import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
    UseGuards, Req
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto} from './dto/create-client.dto';
import { UpdateClientDto} from './dto/update-client.dto';
import { Client } from '../schemas/client.schema';
import { Roles } from '../auth/roles.decorator';
import {CheckValidityDto} from "./dto/check-validity.dto";
import { CustomAuthGuard } from '../auth/auth.guard';


@Controller('client')
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    //CRUD
    @Post()
    async create(@Body() createClientDto: CreateClientDto): Promise<Client> {
        return this.clientService.create(createClientDto);
    }

    @Get()
    @Roles('admin')
    @UseGuards(CustomAuthGuard)
    findAll(): Promise<Client[]> {
        return this.clientService.findAll();
    }

    @Get(':id')
    @Roles('user', 'admin')
    @UseGuards(CustomAuthGuard)
    findOne(@Param('id') id: string): Promise<Client> {
        return this.clientService.findOne(id);
    }

    @Get('/byFirebaseId/:uid')
    @Roles('user', 'admin')
    @UseGuards(CustomAuthGuard)
    findOneByFirebaseId(@Param('uid') uid: string): Promise<Client> {
        return this.clientService.findOneByFirebaseId(uid);
    }

    @Put(':id')
    @Roles('user', 'admin')
    @UseGuards(CustomAuthGuard)
    async update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto, @Req() req
    ): Promise<Client> {
        return this.clientService.update(id, updateClientDto,req.user);
    }

    //@Delete(':id')
    //remove(@Param('id') id: string): Promise<Client> {
      //  return this.clientService.remove(id);
    //}

    //


    @Post('checkValidity')
    async checkPseudoUnique(@Body() checkValidityDto: CheckValidityDto): Promise<{ isUnique: boolean; errorMessage: string }> {
        return this.clientService.checkPseudoUnique(checkValidityDto.pseudo);
    }

    @Post('checkValidity/:id')
    async checkPseudoUniqueExceptCurrentUser(@Param('id') id: string, @Body() checkValidityDto: CheckValidityDto): Promise<{ isUnique: boolean; errorMessage: string }> {
        return this.clientService.checkPseudoUniqueExceptCurrentUser( id, checkValidityDto.pseudo);
    }

}
