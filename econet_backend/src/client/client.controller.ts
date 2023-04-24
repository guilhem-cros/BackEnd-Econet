import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
    UseGuards
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto} from './dto/create-client.dto';
import { UpdateClientDto} from './dto/update-client.dto';
import { Client } from '../schemas/client.schema';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import {CheckValidityDto} from "./dto/check-validity.dto";

@Controller('client')
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    //CRUD
    @Post()
    async create(@Body() createClientDto: CreateClientDto): Promise<Client> {
        return this.clientService.create(createClientDto);
    }

    @Get()
    @Roles('user', 'admin')
    @UseGuards(AuthGuard('jwt'))
    findAll(): Promise<Client[]> {
        return this.clientService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Client> {
        return this.clientService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto,
    ): Promise<Client> {
        return this.clientService.update(id, updateClientDto);
    }

    //@Delete(':id')
    //remove(@Param('id') id: string): Promise<Client> {
      //  return this.clientService.remove(id);
    //}

    //


    @Post('checkValidity')
    async checkEmailPseudoUnique(@Body() checkValidityDto: CheckValidityDto): Promise<{ isUnique: boolean; errorMessage: string }> {
        return this.clientService.checkEmailPseudoUnique(checkValidityDto.email, checkValidityDto.pseudo);
    }

}
