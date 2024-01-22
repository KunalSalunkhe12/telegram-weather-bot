import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramService } from './telegram/telegram.service';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
config({ path: '.env.local' });
import { UserModule } from './user/user.module';
import { WeatherService } from './weather/weather.service';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    UserModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService, TelegramService, WeatherService],
})
export class AppModule {}
