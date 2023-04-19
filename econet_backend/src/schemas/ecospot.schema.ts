import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import {Spot} from "./spot.schema";
import {ObjectId} from "mongoose";

@Schema()
export class EcoSpot extends Spot {
    //Propriétés spécifiques aux Ecospots ci-dessous

    @Prop({required: true})
    details: string;

    @Prop({required: true})
    tips: string;

    @Prop({required: true})
    picture_url: string;

    @Prop({type: {},required: true})
    main_type: {
        _id: ObjectId;
        name: string;
        color: string;
        logo_url: string;
        description: string;
    };

    @Prop({type:[String],required: true, default: []})
    other_types: string[];

    @Prop({required: true, default: false})
    isPublished: boolean;
}

export const EcoSpotSchema = SchemaFactory.createForClass(EcoSpot);


