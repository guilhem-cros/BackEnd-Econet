import {forwardRef, HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {isValidObjectId, Model} from 'mongoose';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { Type } from '../schemas/type.schema';
import {EcospotService} from "../ecospot/ecospot.service";


@Injectable()
export class TypeService {
    constructor(@InjectModel(Type.name) private typeModel: Model<Type>,
                @Inject(forwardRef(() => EcospotService)) private readonly ecoSpotService: EcospotService) {}

    /**
     * Check if a specified string is a valid ObjectId
     * @param id the checked string
     * @private
     * @throws HttpException if the id is invalid
     */
    private checkId(id: string){
        if(!isValidObjectId(id)){
            throw new HttpException("Type not found",HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Create a type using a createTypeDto and save it into the DB
     * @param createTypeDto
     * @return the saved type
     * @throws HttpException if an error occurs during the operation
     */
    async create(createTypeDto: CreateTypeDto): Promise<Type> {
        try{
            const createdType = new this.typeModel(createTypeDto);
            return await createdType.save();
        }
        catch (error){
            throw new HttpException("Internal servor error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get all types from the database
     * @return a list of Type
     * @throws HttpException if an error occurs during operation
     */
    async findAll(): Promise<Type[]> {
        try {
            return await this.typeModel.find().sort({ name: 1 }).exec();
        } catch (error) {
            throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get a single type using its id
     * @param id the id of the looked for type
     * @return the matching Type
     * @throws HttpException if the id isn't found or invalid, if an error occurs during the operation
     */
    async findOne(id: string): Promise<Type> {
        this.checkId(id);
        try {
            const type = await this.typeModel.findById(id).exec();
            if(!type){
                throw new HttpException("Type not found",HttpStatus.NOT_FOUND);
            }
            return type;
        }
        catch (error){
            throw new HttpException("Internal servor error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update a type by its id and using a updateTypeDto object as updated data
     * Handle the update of the main types in ecospots if necessary
     * @param id the id of the type to update
     * @param updateTypeDto the dto object containing data used to update the type
     * @return the updated type
     * @throws HttpException if the specified id is invalid
     *                      if an error occurs during the operation
     */
    async update(id: string, updateTypeDto: UpdateTypeDto): Promise<Type> {
        this.checkId(id);
        try{
            const updatedType = await this.typeModel
                .findOneAndUpdate({ _id: id }, { $set: updateTypeDto }, { new: true })
                .exec();
            await this.updateMainTypeInEcoSpots(updatedType);
            return updatedType;
        }
        catch (error){
            throw new HttpException("Internal servor error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove a type from the database by its id
     * !!! Does not handle the deletion of the type in the associated ecospots !!!
     * @param id the id of the type to remove
     * @return the deleted type
     * @throws HttpException if an error occurs during operation
     */
    async remove(id: string): Promise<Type> {
        this.checkId(id);
        try{
            return await this.typeModel.findByIdAndRemove(id).exec();
        }
        catch (error){
            throw new HttpException("Internal servor error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove a specified ecospot from every type associated to it
     * @param ecoSpotId the id of the ecospot to remove from the associated spots
     * @throws HttpException if ecoSpotId isn't valid
     *                      if an error occurs during the operation
     */
    async removeEcoSpotFromAssociatedSpots(ecoSpotId: string): Promise<void> {
        if(!isValidObjectId(ecoSpotId)){
            throw new HttpException("Ecospot not found",HttpStatus.NOT_FOUND);
        }
        try{
            await this.typeModel.updateMany(
                { associated_spots: ecoSpotId },
                { $pull: { associated_spots: ecoSpotId } }
            );
        }
        catch (error){
            throw new HttpException("Internal servor error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update a specified type in every ecospot of matching main_type
     * @param type Type to update in ecospots
     * @throws HttpException if an error occurs during the operation
     */
    async updateMainTypeInEcoSpots(type: Type): Promise<void> {
        const associatedEcoSpots = type.associated_spots;
        for (const ecoSpotId of associatedEcoSpots) {
            const ecoSpot = await this.ecoSpotService.findOne(ecoSpotId);

            if (ecoSpot && ecoSpot.main_type._id.toString() === type._id.toString()) {
                try{
                    await this.ecoSpotService.update(ecoSpotId, {main_type_id: type._id.toString()}, type);
                }
                catch (error){
                    throw new HttpException("Internal servor error", HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
        }
    }

    /**
     * Add the id of a specified ecospot to the associated_spots of a specified type
     * @param typeId the id of the type to update
     * @param ecoSpotId the ecospot id to add to the type
     * @return the updated type
     */
    async addEcoSpotToType(typeId: string, ecoSpotId: string): Promise<Type> {
        return this.typeModel.findByIdAndUpdate(
            typeId,
            { $addToSet: { associated_spots: ecoSpotId } },
            { new: true, useFindAndModify: false },
        );
    }

    /**
     * Remove the id of a specified ecospot from the associated_spots of a specified type
     * @param typeId the id of the type to update
     * @param ecoSpotId the ecospot to remove from the type
     * @return the updated type
     */
    async removeEcoSpotFromType(typeId: string, ecoSpotId: string): Promise<Type> {
        return this.typeModel.findByIdAndUpdate(
            typeId,
            { $pull: { associated_spots: ecoSpotId } },
            { new: true, useFindAndModify: false },
        );
    }

    /**
     * Get a type from the database by its id but without its list of associated spots
     * @param id the id of the type to get
     * @return the matching type object, without the associated_spots array
     * @throws HttpException if the id is invalid or does not match any type
     *                      if an error occurs during the operation
     */
    async findOneWithoutAssociatedSpots(id: string): Promise<Type> {
        this.checkId(id);
        try {
            const type = await this.typeModel.findById(id, {associated_spots: 0}).exec();
            if(!type){
                throw new HttpException("Type not found",HttpStatus.NOT_FOUND);
            }
            return type;
        }
        catch (error){
            throw new HttpException("Internal servor error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}

