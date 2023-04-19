import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Schema of the document corresponding to every type of spot registered on the app
 */
@Schema()
export class Spot extends Document {

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    address: string;

}

export const SpotSchema = SchemaFactory.createForClass(Spot);
