import {forwardRef, Module} from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Client, ClientSchema} from "../schemas/client.schema";
import {EcospotModule} from "../ecospot/ecospot.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }])
  ],
  providers: [ClientService],
  controllers: [ClientController],
  exports: [ClientService]
})
export class ClientModule {}
