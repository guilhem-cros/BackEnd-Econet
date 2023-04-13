import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { EcospotService } from './ecospot.service';
import { CreateEcoSpotDto} from './dto/create-ecospot.dto';
import { UpdateEcoSpotDto} from './dto/update-ecospot.dto';
import { EcoSpot } from '../schemas/ecospot.schema';

@Controller('ecospot')
export class EcospotController {
    constructor(private readonly ecospotService: EcospotService) {}

    @Post()
    create(@Body() createEcoSpotDto: CreateEcoSpotDto): Promise<EcoSpot> {
        return this.ecospotService.create(createEcoSpotDto);
    }

    @Get()
    findAll(): Promise<EcoSpot[]> {
        return this.ecospotService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<EcoSpot> {
        return this.ecospotService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateEcoSpotDto: UpdateEcoSpotDto): Promise<EcoSpot> {
        return this.ecospotService.update(id, updateEcoSpotDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<EcoSpot> {
        return this.ecospotService.remove(id);
    }
}
