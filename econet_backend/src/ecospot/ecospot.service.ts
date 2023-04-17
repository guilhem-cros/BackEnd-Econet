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

    private checkId(id: string){
        if(!isValidObjectId(id)){
            throw new HttpException("Ecospot not found",HttpStatus.NOT_FOUND);
        }
    }

    async create(createEcoSpotDto: CreateEcoSpotDto, clientId: string, pictureBuffer: Buffer): Promise<EcoSpot> {
        try{
            const mainType = await this.typeService.findOne(createEcoSpotDto.main_type_id);
            const createdEcoSpot = new this.ecoSpotModel({
                ...createEcoSpotDto,
                main_type: mainType,
                picture: pictureBuffer
            });
            const savedEcoSpot = await createdEcoSpot.save();

            // Mettre à jour le type principal
            await this.typeService.addEcoSpotToType(createEcoSpotDto.main_type_id, savedEcoSpot._id);

            // Mettre à jour les types secondaires
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

    async findAll(): Promise<EcoSpot[]> {
        try{
            return await this.ecoSpotModel.find().exec();
        }
        catch(error){
            throw new HttpException("Internal servor error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

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

    async findByType(typeId: string): Promise<EcoSpot[]> {
        const type = await this.typeService.findOne(typeId);
        if (!type) {
            throw new HttpException("Type not found",HttpStatus.NOT_FOUND);
        }
        const ecoSpotIds = type.associated_spots;
        return await Promise.all(ecoSpotIds.map(id => this.findOne(id)));
    }



}

