import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Type extends Document {
    @Prop({required: true, unique: true})
    name: string;

    @Prop({required: true, unique: true})
    color: string;

    @Prop({required: true})
    description: string;

    @Prop({required: true, unique: true})
    logo_url: string;

    @Prop({type:[String],required: true, default: []})
    associated_spots: string[];
}

export const TypeSchema = SchemaFactory.createForClass(Type);
