import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";

/**
 * Schema of the sub-document corresponding to an author of a publication
 * It only contains useful params, as the pseudo of the client who wrote the publication
 * and his id
 */
@Schema()
export class Author extends Document{
    @Prop()
    id: string;
    pseudo: string;
}

/**
 * Schema of the document corresponding to every type of publication on the app
 */
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
