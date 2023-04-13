import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {isValidObjectId, Model} from 'mongoose';
import { CreateEcoSpotDto } from './dto/create-ecospot.dto';
import { UpdateEcoSpotDto } from './dto/update-ecospot.dto';
import { EcoSpot } from '../schemas/ecospot.schema';

@Injectable()
export class EcospotService {
    constructor(@InjectModel(EcoSpot.name) private ecoSpotModel: Model<EcoSpot>) {}

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
            return await this.ecoSpotModel.findByIdAndUpdate(id, updateEcoSpotDto, { new: true }).exec();
        }
        catch (error){
            throw new HttpException("Internal servor error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    async remove(id: string): Promise<EcoSpot> {
        this.checkId(id);
        try{
            return await this.ecoSpotModel.findByIdAndRemove(id).exec();
        }
        catch (error){
            throw new HttpException("Internal servor error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

