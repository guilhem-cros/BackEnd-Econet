import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {isValidObjectId, Model} from 'mongoose';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from '../schemas/client.schema';

@Injectable()
export class ClientService {
    constructor(@InjectModel(Client.name) private clientModel: Model<Client>) {}

    private checkId(id: string){
        if(!isValidObjectId(id)){
            throw new HttpException("Client not found",HttpStatus.NOT_FOUND);
        }
    }
    async create(createClientDto: CreateClientDto): Promise<Client> {
        try{
            const createdClient = new this.clientModel(createClientDto);
            return await createdClient.save();
        }
        catch(error){
            throw new HttpException("Internal servor error", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async findAll(): Promise<Client[]> {
        try{
            return await this.clientModel.find().exec();
        }
        catch(error){
            throw new HttpException("Internal servor error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findOne(id: string): Promise<Client> {
        this.checkId(id);
        try{
            const client = await this.clientModel.findById(id).exec();
            if(!client){
                throw new HttpException("Client not found", HttpStatus.NOT_FOUND);
            }
            return client;
        }
        catch(error){
            throw new HttpException("Internal servor error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findOneByFirebaseId(firebaseId: string): Promise<Client> {
        try{
            const client = await this.clientModel.findOne({firebaseId:firebaseId}).exec();
            if(!client){
                throw new HttpException("Client not found", HttpStatus.NOT_FOUND);
            }
            return client;
        }
        catch(error){
            throw new HttpException("Internal servor error", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
    async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
        this.checkId(id);
        try{
            return await this.clientModel.findByIdAndUpdate(id, updateClientDto, { new: true }).exec();
        }
        catch (error){
            throw new HttpException("Internal servor error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateByFirebaseId(firebaseId: string, updateClientDto: UpdateClientDto): Promise<Client> {
        try{
            return await this.clientModel.findOneAndUpdate({firebaseId: firebaseId}, updateClientDto, { new: true }).exec();
        }
        catch (error) {
            throw new HttpException("Internal servor error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async remove(id: string): Promise<Client> {
        this.checkId(id);
        try{
            return await this.clientModel.findByIdAndRemove(id).exec();
        }
        catch (error){
            throw new HttpException("Internal servor error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async removeByFirebaseId(firebaseId: string): Promise<Client> {
        try{
            return await this.clientModel.findOneAndRemove({firebaseId:firebaseId}).exec();
        }
        catch (error) {
            throw new HttpException("Internal servor error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}

