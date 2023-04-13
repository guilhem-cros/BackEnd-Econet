import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";
import {Spot} from "./spot.schema";

@Schema()
export class Author extends Document{
    @Prop()
    id: string;
    pseudo: string;
}

@Schema()
export class Publication extends Document {

    @Prop({required: true})
    title: string;

    @Prop({required: true})
    publication_date: Date;

    @Prop({required: true, type: Author})
    author: Author;
}

export const PublicationSchema = SchemaFactory.createForClass(Publication);
