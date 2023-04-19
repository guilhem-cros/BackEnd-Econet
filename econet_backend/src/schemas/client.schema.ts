import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {EcoSpot} from "./ecospot.schema";
import * as mongoose from "mongoose";

/**
 * Schema of the document representing the clients registered to the app
 */
@Schema()
export class Client extends Document {
    @Prop({required: true})
    full_name: string;

    @Prop({required: true, unique: true})
    pseudo: string;

    @Prop({required: true, unique: true})
    email: string;

    @Prop({required: true, unique: true})
    firebaseId: string;

    @Prop({required: true, default: false})
    isAdmin: boolean;

    @Prop({required: true})
    profile_pic_url: string;

    /**
     * List containing every id of articles marked as favorite by the client
     */
    @Prop({type:[String],required: true, default: []})
    fav_articles: string[];

    /**
     * List containing every id of publications created by the client
     */
    @Prop({type:[String],required: true, default: []})
    created_publications: string[];

    /**
     * List containing every id of ecospots marked as favorite by the client
     */
    @Prop({type:[{type: mongoose.Schema.Types.ObjectId,ref:EcoSpot.name}],required: true, default: []})
    fav_ecospots: EcoSpot[];

    /**
     * List containing every id of ecospots created by the client
     */
    @Prop({type:[{type: mongoose.Schema.Types.ObjectId,ref:EcoSpot.name}],required: true, default: []})
    created_ecospots: EcoSpot[];
}

export const ClientSchema = SchemaFactory.createForClass(Client);
