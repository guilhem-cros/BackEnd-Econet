import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {EcoSpot} from "./ecospot.schema";
import * as mongoose from "mongoose";
import {EcospotService} from "../ecospot/ecospot.service";

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

    @Prop({type: Buffer, required: true})
    profile_pic: Buffer;

    @Prop({type:[String],required: true, default: []})
    fav_articles: string[];

    @Prop({type:[String],required: true, default: []})
    created_publications: string[];

    @Prop({type:[{type: mongoose.Schema.Types.ObjectId,ref:EcoSpot.name}],required: true, default: []})
    fav_ecospots: EcoSpot[];

    @Prop({type:[{type: mongoose.Schema.Types.ObjectId,ref:EcoSpot.name}],required: true, default: []})
    created_ecospots: EcoSpot[];
}

export const ClientSchema = SchemaFactory.createForClass(Client);
