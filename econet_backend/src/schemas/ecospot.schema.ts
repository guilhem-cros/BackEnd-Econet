import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import {Spot} from "./spot.schema";
import {ObjectId} from "mongoose";

/**
 * Schema of the document representing the ecospots
 * Ecospot objects inherit of Spot
 */
@Schema()
export class EcoSpot extends Spot {

    @Prop({required: true})
    details: string;

    @Prop({required: true})
    tips: string;

    @Prop({required: true})
    picture_url: string;

    /**
     * Embedded document representing the main type of the ecospot
     * It only contains useful params
     */
    @Prop({type: {},required: true})
    main_type: {
        _id: ObjectId;
        name: string;
        color: string;
        logo_url: string;
        description: string;
    };

    /**
     * List containing every id of the other types linked to the ecospot
     */
    @Prop({type:[String],required: true, default: []})
    other_types: string[];

    @Prop({required: true, default: false})
    isPublished: boolean;
}

export const EcoSpotSchema = SchemaFactory.createForClass(EcoSpot);


