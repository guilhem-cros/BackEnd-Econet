import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ discriminatorKey: 'spotType' })
export class Spot extends Document {
    //Propriétés communes à tous les spots ci-dessous
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    address: string;

}

export const SpotSchema = SchemaFactory.createForClass(Spot);
