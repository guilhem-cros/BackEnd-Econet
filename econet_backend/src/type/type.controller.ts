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
import { TypeService } from './type.service';
import { CreateTypeDto} from './dto/create-type.dto';
import { UpdateTypeDto} from './dto/update-type.dto';
import { Type } from '../schemas/type.schema';
import {FileInterceptor} from "@nestjs/platform-express";
import {Express} from "express";
import * as sharp from 'sharp';

@Controller('type')
export class TypeController {
    constructor(private readonly typeService: TypeService) {}

    @Post()
    @UseInterceptors(FileInterceptor('logo'))
    async create(@UploadedFile() logo: Express.Multer.File, @Body() createTypeDto: CreateTypeDto): Promise<Type> {
        if (!logo || !logo.mimetype.startsWith('image/')) {
            throw new HttpException("File isn't an image",HttpStatus.NOT_ACCEPTABLE);
        }
        else{
            try {
                const logoBuffer = await sharp(logo.buffer).resize({width: 500}).toBuffer()
                return this.typeService.create(createTypeDto, logoBuffer);
            } catch (error){
                throw new HttpException('Error processing image', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Get()
    findAll(): Promise<Type[]> {
        return this.typeService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Type> {
        return this.typeService.findOne(id);
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('logo'))
    async update(@Param('id') id: string, @UploadedFile() logo: Express.Multer.File, @Body() updateTypeDto: UpdateTypeDto): Promise<Type> {
        if(logo){
            if(!logo.mimetype.startsWith('image/')){
                throw new HttpException("File isn't an image", HttpStatus.NOT_ACCEPTABLE);
            }
            updateTypeDto.logo = await sharp(logo.buffer).resize({width: 500}).toBuffer();
        }
        return this.typeService.update(id, updateTypeDto);
    }

    //@Delete(':id')
    //remove(@Param('id') id: string): Promise<Type> {
      //  return this.typeService.remove(id);
    //}
}
