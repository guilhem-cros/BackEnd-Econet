import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Category extends Document{
    @Prop()
    label: string;
}

@Schema()
export class Author extends Document{
    @Prop()
    id: string;
    pseudo: string;
}
@Schema()
export class Article extends Document {
    @Prop({required: true})
    title: string;

    @Prop({required: true})
    publication_date: Date;

    @Prop({required: true})
    content: string;

    @Prop({required: true, type: Author})
    author: Author;

    @Prop({required: true, type: Category})
    category: Category;

}

export const ArticleSchema = SchemaFactory.createForClass(Article);
