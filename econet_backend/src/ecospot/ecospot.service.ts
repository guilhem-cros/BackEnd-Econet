import {forwardRef, HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {isValidObjectId, Model} from 'mongoose';
import { CreateEcoSpotDto } from './dto/create-ecospot.dto';
import { UpdateEcoSpotDto } from './dto/update-ecospot.dto';
import { EcoSpot } from '../schemas/ecospot.schema';
import {TypeService} from "../type/type.service";
import {ClientService} from "../client/client.service";
import {Type} from "../schemas/type.schema";

@Injectable()
export class EcospotService {
    constructor(@InjectModel(EcoSpot.name) private ecoSpotModel: Model<EcoSpot>,
                @Inject(forwardRef(() => TypeService)) private readonly typeService: TypeService,
                @Inject(forwardRef(() => ClientService)) private readonly clientService: ClientService,) {}

    /**
     * Check if a specified string is a valid ObjectId
     * @param id the checked string
     * @private
     * @throws HttpException if the id is invalid
     */
    private checkId(id: string){
        if(!isValidObjectId(id)){
            throw new HttpException("Ecospot not found",HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Create an ecospot using a createEcospotDto and save it into the DB
     * Then add this created ecospot to the list of created ecospot of the associated client
     * Handle the add to this ecospot to the associated types
     * @param createEcoSpotDto
     * @param clientId
     * @return the saved ecospot
     * @throws HttpException if an error occurs during the operation
     */
    async create(createEcoSpotDto: CreateEcoSpotDto, clientId: string): Promise<EcoSpot> {
        try{
            //get the main of the ecospot using main_type_id of the dto
            const mainType = await this.typeService.findOneWithoutAssociatedSpots(createEcoSpotDto.main_type_id);
            const createdEcoSpot = new this.ecoSpotModel({
                ...createEcoSpotDto,
                main_type: mainType,
            });
            const savedEcoSpot = await createdEcoSpot.save();

            // Update the main type by adding the ecospot to its associated spots
            await this.typeService.addEcoSpotToType(createEcoSpotDto.main_type_id, savedEcoSpot._id);

            // Update the other types by adding the ecospot to their associated spots
            for (const typeId of savedEcoSpot.other_types) {
                await this.typeService.addEcoSpotToType(typeId, savedEcoSpot._id);
            }

            await this.clientService.addCreatedEcoSpot(clientId, savedEcoSpot);

            return savedEcoSpot;
        }
        catch(error){
            throw new HttpException("Internal servor error", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    /**
     * Get all ecospots from the database
     * @return a list of Ecospot
     * @throws HttpException if an error occurs during operation
     */
    async findAll(): Promise<EcoSpot[]> {
        try{
            return await this.ecoSpotModel.find().exec();
        }
        catch(error){
            throw new HttpException("Internal servor error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get a single ecospot using its id
     * @param id the id of the looked for ecospot
     * @return the matching Ecospot
     * @throws HttpException if the id isn't found or invalid, if an error occurs during the operation
     */
    async findOne(id: string): Promise<EcoSpot> {
        this.checkId(id);
        try{
            const ecospot = await this.ecoSpotModel.findById(id).exec();
            if(!ecospot){
                throw new HttpException("Ecospot not found",HttpStatus.NOT_FOUND);
            }
            return ecospot;
        }
        catch(error){
            throw new HttpException("Internal servor error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update an ecospot by its id and using a updateEcospotDto object as updated data
     * Handle the remove / add of type to the list of types
     * Handle the update of the main type if necessary
     * @param id the id of the ecospot to update
     * @param updateEcoSpotDto the dto object containing data used to update the ecospot
     * @param type the new main type of the ecospot
     * @return the updated ecospot
     * @throws HttpException if the specified id is invalid
     *                      if an error occurs during the operation
     */
    async update(id: string, updateEcoSpotDto: UpdateEcoSpotDto, type?: Type): Promise<EcoSpot> {
        this.checkId(id);
        try {
            let mainType: Type;
            if(!type){
                mainType = await this.typeService.findOneWithoutAssociatedSpots(updateEcoSpotDto.main_type_id);
            } else{
                mainType = type;
            }
            const currentEcoSpot = await this.ecoSpotModel.findById(id).exec();
            const updatedEcoSpot = await this.ecoSpotModel
                .findOneAndUpdate({ _id: id }, { $set: {...updateEcoSpotDto, main_type: mainType} }, { new: true })
                .exec();

            if (currentEcoSpot.main_type !== updatedEcoSpot.main_type) {
                await this.typeService.removeEcoSpotFromType(currentEcoSpot.main_type._id.toString(), id);
                await this.typeService.addEcoSpotToType(updatedEcoSpot.main_type._id.toString(), id);
            }

            const otherTypesToRemove = currentEcoSpot.other_types.filter(t => !updatedEcoSpot.other_types.includes(t));
            const otherTypesToAdd = updatedEcoSpot.other_types.filter(t => !currentEcoSpot.other_types.includes(t));

            for (const typeId of otherTypesToRemove) {
                await this.typeService.removeEcoSpotFromType(typeId, id);
            }
            for (const typeId of otherTypesToAdd) {
                await this.typeService.addEcoSpotToType(typeId, id);
            }

            return updatedEcoSpot;
        } catch (error) {
            throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove an ecospot from the DB by its id
     * Remove this ecospot or its id from every associated list
     * @param id the id of the ecospot to delete
     * @return the ecospot client
     * @throws HttpException if id is invalid
     *                      if an error occurs during operation
     */
    async remove(id: string): Promise<EcoSpot> {
        this.checkId(id);
        try{
            await this.typeService.removeEcoSpotFromAssociatedSpots(id);
            await this.clientService.removeEcoSpotFromClient(id);

            return await this.ecoSpotModel.findByIdAndRemove(id).exec();
        }
        catch (error){
            throw new HttpException("Internal servor error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get every ecospot linked to a specified type
     * @param typeId the id of the type
     * @return a list of ecospot associated to the specified type
     * @throws HttpException if typeId doesn't match any existing type
     */
    async findByType(typeId: string): Promise<EcoSpot[]> {
        const type = await this.typeService.findOne(typeId);
        if (!type) {
            throw new HttpException("Type not found",HttpStatus.NOT_FOUND);
        }
        const ecoSpotIds = type.associated_spots;
        return await Promise.all(ecoSpotIds.map(id => this.findOne(id)));
    }



}

