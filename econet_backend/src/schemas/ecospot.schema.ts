import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class EcoSpot extends Document {
    @Prop({required: true})
    name: string;

    @Prop({required: true, unique: true})
    address: string;

    @Prop({required: true})
    details: string;

    @Prop({required: true})
    tips: string;

    //@Prop()
    //picture: Buffer;

    @Prop({type: {},required: true})
    main_type: {
        id: string;
        name: string;
        color: string;
        //logo: Buffer;
        description: string;
    };

    @Prop({type:[String],required: true})
    other_types: string[];
}

export const EcoSpotSchema = SchemaFactory.createForClass(EcoSpot);
