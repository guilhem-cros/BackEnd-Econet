import { Module } from '@nestjs/common';
import { TypeService } from './type.service';
import { TypeController } from './type.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Type, TypeSchema} from "../schemas/type.schema";
import { EcospotService } from '../ecospot/ecospot.service';
import { EcospotModule } from '../ecospot/ecospot.module';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Type.name, schema: TypeSchema }]),forwardRef(() => EcospotModule)
  ],
  providers: [TypeService],
  controllers: [TypeController],
  exports: [TypeService]
})
export class TypeModule {}
