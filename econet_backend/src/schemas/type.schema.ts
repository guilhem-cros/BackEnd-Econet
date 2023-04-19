import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Schema of the document corresponding to every type that can be associated to an ecospot
 */
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

    /**
     * List containing every id of the ecospots associated to this type
     */
    @Prop({type:[String],required: true, default: []})
    associated_spots: string[];
}

export const TypeSchema = SchemaFactory.createForClass(Type);
