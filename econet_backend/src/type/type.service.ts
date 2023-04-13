import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {isValidObjectId, Model} from 'mongoose';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { Type } from '../schemas/type.schema';

@Injectable()
export class TypeService {
    constructor(@InjectModel(Type.name) private typeModel: Model<Type>) {}

    private checkId(id: string){
        if(!isValidObjectId(id)){
            throw new HttpException("Type not found",HttpStatus.NOT_FOUND);
        }
    }

    async create(createTypeDto: CreateTypeDto): Promise<Type> {
        try{
            const createdType = new this.typeModel(createTypeDto);
            return await createdType.save();
        }
        catch (error){
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
            return await this.typeModel.findByIdAndUpdate(id, updateTypeDto, { new: true }).exec();
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
}

