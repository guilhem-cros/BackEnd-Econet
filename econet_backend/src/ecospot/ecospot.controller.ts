import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete, UseGuards,
} from '@nestjs/common';
import { EcospotService } from './ecospot.service';
import { CreateEcoSpotDto} from './dto/create-ecospot.dto';
import { UpdateEcoSpotDto} from './dto/update-ecospot.dto';
import { EcoSpot } from '../schemas/ecospot.schema';
import {CheckValidityDto} from "../client/dto/check-validity.dto";
import {CheckAddressDto} from "./dto/check-address.dto";
import {Roles} from "../auth/roles.decorator";
import {CustomAuthGuard} from "../auth/auth.guard";

@Controller('ecospot')
export class EcospotController {
    constructor(private readonly ecospotService: EcospotService) {}

    //CRUD

    @Post(':idClient')
    @Roles('user', 'admin')
    @UseGuards(CustomAuthGuard)
    async create(@Body() createEcoSpotDto: CreateEcoSpotDto, @Param('idClient') idClient: string): Promise<EcoSpot> {
        return this.ecospotService.create(createEcoSpotDto, idClient);
    }

    @Post('check/address')
    @Roles('user', 'admin')
    @UseGuards(CustomAuthGuard)
    async checkAddressUnique(@Body() checkAddressDto: CheckAddressDto): Promise<{ isUnique: boolean; errorMessage: string }> {
        return this.ecospotService.checkAddressUnique(checkAddressDto.address);
    }
    @Get()
    @Roles('user', 'admin')
    @UseGuards(CustomAuthGuard)
    findAll(): Promise<EcoSpot[]> {
        return this.ecospotService.findAll();
    }

    @Get(':id')
    @Roles('user', 'admin')
    @UseGuards(CustomAuthGuard)
    findOne(@Param('id') id: string): Promise<EcoSpot> {
        return this.ecospotService.findOne(id);
    }

    @Get('type/:typeId')
    @Roles('user', 'admin')
    @UseGuards(CustomAuthGuard)
    async findByType(@Param('typeId') typeId: string): Promise<EcoSpot[]> {
        return this.ecospotService.findByType(typeId);
    }

    @Get('unpublished/ecospots')
    @Roles('user', 'admin')
    @UseGuards(CustomAuthGuard)
    async getUnpublishedEcoSpots(): Promise<EcoSpot[]> {
        return await this.ecospotService.findUnpublishedEcospots();
    }

    @Get('published/ecospots')
    @Roles('admin')
    @UseGuards(CustomAuthGuard)
    async getPublishedEcoSpots(): Promise<EcoSpot[]> {
        return await this.ecospotService.findPublishedEcospots();
    }

    @Put(':id')
    @Roles('admin')
    @UseGuards(CustomAuthGuard)
    async update(@Param('id') id: string, @Body() updateEcoSpotDto: UpdateEcoSpotDto): Promise<EcoSpot> {
        return this.ecospotService.update(id, updateEcoSpotDto);
    }

    @Delete(':id')
    @Roles('admin')
    @UseGuards(CustomAuthGuard)
    remove(@Param('id') id: string): Promise<EcoSpot> {
        return this.ecospotService.remove(id);
    }

    //

}
