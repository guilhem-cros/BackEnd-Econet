import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
    UploadedFile,
    UseInterceptors,
    HttpException, HttpStatus
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto} from './dto/create-client.dto';
import { UpdateClientDto} from './dto/update-client.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Client } from '../schemas/client.schema';
import {Express} from "express";
import * as sharp from 'sharp';

@Controller('client')
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    @Post()
    @UseInterceptors(FileInterceptor('profile_pic'))
    async create(@UploadedFile() profile_pic: Express.Multer.File ,@Body() createClientDto: CreateClientDto): Promise<Client> {
        if (!profile_pic || !profile_pic.mimetype.startsWith('image/')) {
            throw new HttpException("File isn't an image",HttpStatus.NOT_ACCEPTABLE);
        }
        else{
            try {
                const profilePicBuffer = await sharp(profile_pic.buffer).resize({ width: 500 }).toBuffer();
                return this.clientService.create(createClientDto, profilePicBuffer);
            } catch(error){
                throw new HttpException('Error processing image', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Get()
    findAll(): Promise<Client[]> {
        return this.clientService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Client> {
        return this.clientService.findOne(id);
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('profile_pic'))
    async update(@Param('id') id: string, @UploadedFile() profile_pic: Express.Multer.File, @Body() updateClientDto: UpdateClientDto,
    ): Promise<Client> {
        if (profile_pic) {
            if (!profile_pic.mimetype.startsWith('image/')) {
                throw new HttpException("File isn't an image", HttpStatus.NOT_ACCEPTABLE);
            }
            updateClientDto.profile_pic = await sharp(profile_pic.buffer).resize({ width: 500 }).toBuffer();
        }

        return this.clientService.update(id, updateClientDto);
    }

    //@Delete(':id')
    //remove(@Param('id') id: string): Promise<Client> {
      //  return this.clientService.remove(id);
    //}
}
