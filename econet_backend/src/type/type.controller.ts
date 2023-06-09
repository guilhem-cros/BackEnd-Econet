import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete, UseGuards,
} from '@nestjs/common';
import { TypeService } from './type.service';
import { CreateTypeDto} from './dto/create-type.dto';
import { UpdateTypeDto} from './dto/update-type.dto';
import { Type } from '../schemas/type.schema';
import {Roles} from "../auth/roles.decorator";
import {CustomAuthGuard} from "../auth/auth.guard";

@Controller('type')
export class TypeController {
    constructor(private readonly typeService: TypeService) {}

    //CRUD

    @Post()
    @Roles('admin')
    @UseGuards(CustomAuthGuard)
    async create( @Body() createTypeDto: CreateTypeDto): Promise<Type> {
        return this.typeService.create(createTypeDto);
    }

    @Get()
    @Roles('user', 'admin')
    @UseGuards(CustomAuthGuard)
    findAll(): Promise<Type[]> {
        return this.typeService.findAll();
    }

    @Get(':id')
    @Roles('user', 'admin')
    @UseGuards(CustomAuthGuard)
    findOne(@Param('id') id: string): Promise<Type> {
        return this.typeService.findOne(id);
    }

    @Put(':id')
    @Roles('admin')
    @UseGuards(CustomAuthGuard)
    async update(@Param('id') id: string, @Body() updateTypeDto: UpdateTypeDto): Promise<Type> {
        return this.typeService.update(id, updateTypeDto);
    }

    //@Delete(':id')
    //remove(@Param('id') id: string): Promise<Type> {
      //  return this.typeService.remove(id);
    //}

    //
}
