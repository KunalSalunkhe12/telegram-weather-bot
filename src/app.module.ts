import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramService } from './telegram/telegram.service';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
import { UserModule } from './user/user.module';
config();

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URI), UserModule],
  controllers: [AppController],
  providers: [AppService, TelegramService],
})
export class AppModule {}
