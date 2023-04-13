import { Module } from '@nestjs/common';
import { EcospotService } from './ecospot.service';
import { EcospotController } from './ecospot.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {EcoSpot, EcoSpotSchema} from "../schemas/ecospot.schema";
import { forwardRef } from '@nestjs/common';
import { TypeModule } from '../type/type.module';
import {ClientModule} from "../client/client.module";
import {TypeService} from "../type/type.service";
import {ClientService} from "../client/client.service";
@Module({
  imports: [
    MongooseModule.forFeature([{ name: EcoSpot.name, schema: EcoSpotSchema }]),
    forwardRef(() => TypeModule),
    forwardRef(() => ClientModule),
  ],
  providers: [EcospotService],
  controllers: [EcospotController],
  exports: [EcospotService]
})
export class EcospotModule {}
