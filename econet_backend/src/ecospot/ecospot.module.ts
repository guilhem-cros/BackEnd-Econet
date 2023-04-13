import { Module } from '@nestjs/common';
import { EcospotService } from './ecospot.service';
import { EcospotController } from './ecospot.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {EcoSpot, EcoSpotSchema} from "../schemas/ecospot.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: EcoSpot.name, schema: EcoSpotSchema }]),
  ],
  providers: [EcospotService],
  controllers: [EcospotController],
})
export class EcospotModule {}
