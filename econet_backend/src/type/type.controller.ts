import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
} from '@nestjs/common';
import { TypeService } from './type.service';
import { CreateTypeDto} from './dto/create-type.dto';
import { UpdateTypeDto} from './dto/update-type.dto';
import { Type } from '../schemas/type.schema';

@Controller('type')
export class TypeController {
    constructor(private readonly typeService: TypeService) {}

    @Post()
    async create( @Body() createTypeDto: CreateTypeDto): Promise<Type> {
        return this.typeService.create(createTypeDto);
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
    async update(@Param('id') id: string, @Body() updateTypeDto: UpdateTypeDto): Promise<Type> {
        return this.typeService.update(id, updateTypeDto);
    }

    //@Delete(':id')
    //remove(@Param('id') id: string): Promise<Type> {
      //  return this.typeService.remove(id);
    //}
}
