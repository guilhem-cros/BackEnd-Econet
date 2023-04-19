import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {Publication} from "./publication.schema";

/**
 * Schema of the sub-document representing the category of an article
 */
@Schema()
export class Category extends Document{
    @Prop()
    label: string;
}

/**
 * Schema of the document representing articles
 * Article objects inherit of Publication
 */
@Schema()
export class Article extends Publication {

    @Prop({required: true})
    content: string;

    @Prop({required: true, type: Category})
    category: Category;

}

export const ArticleSchema = SchemaFactory.createForClass(Article);
