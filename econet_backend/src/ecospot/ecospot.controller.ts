import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
    UseInterceptors,
    UploadedFile,
    HttpException, HttpStatus
} from '@nestjs/common';
import { EcospotService } from './ecospot.service';
import { CreateEcoSpotDto} from './dto/create-ecospot.dto';
import { UpdateEcoSpotDto} from './dto/update-ecospot.dto';
import { EcoSpot } from '../schemas/ecospot.schema';
import * as sharp from 'sharp';
import {FileInterceptor} from "@nestjs/platform-express";
import {Express} from "express";

@Controller('ecospot')
export class EcospotController {
    constructor(private readonly ecospotService: EcospotService) {}

    @Post(':idClient')
    @UseInterceptors(FileInterceptor('picture'))
    async create(@UploadedFile() picture: Express.Multer.File, @Body() createEcoSpotDto: CreateEcoSpotDto, @Param('idClient') idClient: string): Promise<EcoSpot> {
        if(!picture || !picture.mimetype.startsWith('image/')){
            throw new HttpException("File isn't an image",HttpStatus.NOT_ACCEPTABLE);
        }
        else{
            try{
                const pictureBuffer = await sharp(picture.buffer).resize({width: 500}).toBuffer();
                return this.ecospotService.create(createEcoSpotDto, idClient, pictureBuffer);
            } catch (error){
                throw new HttpException('Error processing image', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Get()
    findAll(): Promise<EcoSpot[]> {
        return this.ecospotService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<EcoSpot> {
        return this.ecospotService.findOne(id);
    }

    @Get('type/:typeId')
    async findByType(@Param('typeId') typeId: string): Promise<EcoSpot[]> {
        return this.ecospotService.findByType(typeId);
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('picture'))
    async update(@UploadedFile() picture: Express.Multer.File, @Param('id') id: string, @Body() updateEcoSpotDto: UpdateEcoSpotDto): Promise<EcoSpot> {
        if(picture){
            if(!picture.mimetype.startsWith('image/')){
                throw new HttpException("File isn't an image", HttpStatus.NOT_ACCEPTABLE);
            }
            updateEcoSpotDto.picture = await sharp(picture.buffer).resize({width: 500}).toBuffer();
        }
        return this.ecospotService.update(id, updateEcoSpotDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<EcoSpot> {
        return this.ecospotService.remove(id);
    }
}
