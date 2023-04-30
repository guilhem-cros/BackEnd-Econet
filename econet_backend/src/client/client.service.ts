import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {isValidObjectId, Model} from 'mongoose';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from '../schemas/client.schema';
import {EcoSpot} from "../schemas/ecospot.schema";
import {setUserRole} from "../auth/auth.service";

@Injectable()
export class ClientService {
    constructor(@InjectModel(Client.name) private clientModel: Model<Client>) {}

    /**
     * Check if a specified string is a valid ObjectId
     * @param id the checked string
     * @private
     * @throws HttpException if id is invalid
     */
    private checkId(id: string){
        if(!isValidObjectId(id)){
            throw new HttpException("Client not found",HttpStatus.NOT_FOUND);
        }
    }

    async   checkEmailPseudoUnique(email: string, pseudo: string): Promise<{ isUnique: boolean; errorMessage: string }> {
        try{
            const emailExists = await this.clientModel.findOne({ email: email }).exec();
            const pseudoExists = await this.clientModel.findOne({ pseudo: pseudo }).exec();

            if (emailExists) {
                return { isUnique: false, errorMessage: "L'adresse mail saisie est déjà associée à un compte." };
            } else if (pseudoExists) {
                return { isUnique: false, errorMessage: "Le pseudo saisi est déjà associé à un compte." };
            } else {
                return { isUnique: true, errorMessage: '' };
            }
        }
        catch(error){
            throw new HttpException("Internal servor error", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async checkEmailPseudoUniqueExceptCurrentUser(
        userId: string,
        email: string,
        pseudo: string,
    ): Promise<{ isUnique: boolean; errorMessage: string }> {
        try{
            const emailExists = await this.clientModel.findOne({ _id: { $ne: userId }, email: email }).exec();
            const pseudoExists = await this.clientModel.findOne({ _id: { $ne: userId }, pseudo: pseudo }).exec();

            if (emailExists) {
                return { isUnique: false, errorMessage: "L'adresse mail saisie est déjà associée à un compte." };
            } else if (pseudoExists) {
                return { isUnique: false, errorMessage: "Le pseudo saisi est déjà associé à un compte." };
            } else {
                return { isUnique: true, errorMessage: '' };
            }
        }
        catch(error){
            throw new HttpException("Internal servor error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    /**
     * Create a client using a createClientDto and save it into the DB
     * Then set the role of the client to user
     * @param createClientDto
     * @return the saved client
     * @throws HttpException if an error occurs during the operation
     */
    async create(createClientDto: CreateClientDto): Promise<Client> {
        try{
            const createdClient = new this.clientModel(createClientDto);
            const savedClient = await createdClient.save();

            await setUserRole(createClientDto.firebaseId, 'user');

            return savedClient;
        }
        catch(error){
            throw new HttpException("Internal servor error", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    /**
     * Get all the registered client from the database
     * @return a list of Client
     * @throws HttpException if an error occurs during operation
     */
    async findAll(): Promise<Client[]> {
        try{
            return await this.clientModel.find().populate('fav_ecospots').populate('created_ecospots').exec();
        }
        catch(error){
            throw new HttpException("Internal servor error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get a single client using its ObjectId and populate its linked lists of ecospots
     * @param id the id of the looked for client
     * @return the matching Client
     * @throws HttpException if the id isn't found or invalid, if an error occurs during the operation
     */
    async findOne(id: string): Promise<Client> {
        this.checkId(id);
        try{
            const client = await this.clientModel.findById(id).populate('fav_ecospots').populate('created_ecospots').exec();
            if(!client){
                throw new HttpException("Client not found", HttpStatus.NOT_FOUND);
            }
            return client;
        }
        catch(error){
            throw new HttpException("Internal servor error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get a single client using its firebaseId and populate its linked lists of ecospots
     * @param firebaseId the firebase uid of the looked for client
     * @return the matching Client
     * @throws HttpException if the id isn't found or invalid, if an error occurs during the operation
     */
    async findOneByFirebaseId(firebaseId: string): Promise<Client> {
        try{
            const client = await this.clientModel.findOne({firebaseId:firebaseId}).populate('fav_ecospots').populate('created_ecospots').exec();
            if(!client){
                throw new HttpException("Client not found", HttpStatus.NOT_FOUND);
            }
            return client;
        }
        catch(error){
            throw new HttpException("Internal servor error", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    /**
     * Update a client by its id and using a updateClientDto object as updated data
     * @param id the id of the client to update
     * @param updateClientDto the dto object containing data used to update the client
     * @return the updated client
     * @throws HttpException if the specified id is invalid
     *                      if an error occurs during the operation
     */
    async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
        this.checkId(id);
        try{
            return await this.clientModel.findByIdAndUpdate(id, updateClientDto, { new: true }).populate('fav_ecospots').populate('created_ecospots').exec();
        }
        catch (error){
            throw new HttpException("Internal servor error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove a client from the DB by its id
     * @param id the id of the client to delete
     * @return the deleted client
     * @throws HttpException if id is invalid
     *                      if an error occurs during operation
     */
    async remove(id: string): Promise<Client> {
        this.checkId(id);
        try{
            return await this.clientModel.findByIdAndRemove(id).exec();
        }
        catch (error){
            throw new HttpException("Internal servor error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove a specified ecospot from every list of the client containing ecospot or id of ecospot
     * @param ecoSpotId the id of the ecospot to remove
     * @throws HttpException if ecospotId doesn't match any ecospot
     *                      if an error occurs during operation
     */
    async removeEcoSpotFromClient(ecoSpotId: string): Promise<void> {
        if(!isValidObjectId(ecoSpotId)){
            throw new HttpException("Ecospot not found",HttpStatus.NOT_FOUND);
        }
        try{
            await this.clientModel.updateMany(
                { $or: [ { fav_ecospots: ecoSpotId }, { created_ecospots: ecoSpotId } ] },
                { $pull: { fav_ecospots: ecoSpotId, created_ecospots: ecoSpotId } }
            );
        }
        catch (error) {
            throw new HttpException("Internal servor error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Adding an ecospot's id in the list associated to the ecospots created by the client
     * @param clientId the client for which ecospot is added
     * @param ecoSpot the ecospot to add
     * @return the updated client
     */
    async addCreatedEcoSpot(clientId: string, ecoSpot: EcoSpot): Promise<Client> {
        return this.clientModel.findByIdAndUpdate(
            clientId,
            { $addToSet: { created_ecospots: ecoSpot } },
            { new: true, useFindAndModify: false },
        );
    }


}

