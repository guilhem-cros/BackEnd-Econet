import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EcospotModule } from './ecospot/ecospot.module';
import { TypeModule } from './type/type.module';
import { ClientModule } from './client/client.module';
import { ArticleModule } from './article/article.module';
import { ConfigModule } from '@nestjs/config';
import { FirebaseAuthMiddleware } from './auth/firebase-auth.middleware';
import { RolesGuard } from './auth/roles.guard';
import {APP_GUARD} from "@nestjs/core";


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URL),
    EcospotModule,
    TypeModule,
    ClientModule,
    ArticleModule,
  ],
  controllers: [AppController],
  providers: [
      AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }
  ],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FirebaseAuthMiddleware).forRoutes('*');
  }
}
