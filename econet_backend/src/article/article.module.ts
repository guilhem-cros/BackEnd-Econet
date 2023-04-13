import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {EcoSpot, EcoSpotSchema} from "../schemas/ecospot.schema";
import {Article, ArticleSchema} from "../schemas/article.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
  ],
  providers: [ArticleService],
  controllers: [ArticleController]
})
export class ArticleModule {}
