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

    private checkId(id: string){
        if(!isValidObjectId(id)){
            throw new HttpException("Type not found",HttpStatus.NOT_FOUND);
        }
    }

    async create(createTypeDto: CreateTypeDto): Promise<Type> {
        try{
            console.log(createTypeDto)
            const createdType = new this.typeModel(createTypeDto);
            console.log(createTypeDto)
            return await createdType.save();
        }
        catch (error){
            console.log(error)
            throw new HttpException("Internal servor error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAll(): Promise<Type[]> {
        try {
            return await this.typeModel.find().exec();
        }
        catch (error){
            throw new HttpException("Internal servor error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

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

    async remove(id: string): Promise<Type> {
        this.checkId(id);
        try{
            return await this.typeModel.findByIdAndRemove(id).exec();
        }
        catch (error){
            throw new HttpException("Internal servor error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

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

    async addEcoSpotToType(typeId: string, ecoSpotId: string): Promise<Type> {
        return this.typeModel.findByIdAndUpdate(
            typeId,
            { $addToSet: { associated_spots: ecoSpotId } },
            { new: true, useFindAndModify: false },
        );
    }

    async removeEcoSpotFromType(typeId: string, ecoSpotId: string): Promise<Type> {
        return this.typeModel.findByIdAndUpdate(
            typeId,
            { $pull: { associated_spots: ecoSpotId } },
            { new: true, useFindAndModify: false },
        );
    }

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

