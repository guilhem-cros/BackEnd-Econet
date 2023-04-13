import {forwardRef, HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {isValidObjectId, Model} from 'mongoose';
import { CreateEcoSpotDto } from './dto/create-ecospot.dto';
import { UpdateEcoSpotDto } from './dto/update-ecospot.dto';
import { EcoSpot } from '../schemas/ecospot.schema';
import {TypeService} from "../type/type.service";
import {ClientService} from "../client/client.service";

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

    async create(createEcoSpotDto: CreateEcoSpotDto): Promise<EcoSpot> {
        try{
            const createdEcospot = new this.ecoSpotModel(createEcoSpotDto);
            return await createdEcospot.save();
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

    async update(id: string, updateEcoSpotDto: UpdateEcoSpotDto): Promise<EcoSpot> {
        this.checkId(id);
        try{
            const updatedEcoSpot = await this.ecoSpotModel
                .findOneAndUpdate({ _id: id }, { $set: updateEcoSpotDto }, { new: true })
                .exec();
            await this.updateEcoSpotInClients(updatedEcoSpot);
            return updatedEcoSpot;        }
        catch (error){
            throw new HttpException("Internal servor error", HttpStatus.INTERNAL_SERVER_ERROR);
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

    async updateEcoSpotInClients(ecoSpot: EcoSpot): Promise<void> {
        const { _id, name, address, main_type, other_types } = ecoSpot;
        const ecoSpotData = { _id, name, address, main_type, other_types };

        await this.clientService.updateEcoSpotInFavAndCreated(ecoSpotData);
    }


}

