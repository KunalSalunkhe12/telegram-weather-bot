import { Injectable, NotFoundException } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import { UserService } from '../user/user.service';
import { config } from 'dotenv';
import { WeatherService } from 'src/weather/weather.service';
config();

@Injectable()
export class TelegramService {
  private bot: TelegramBot;
  private awaitingCityResponse: Record<number, boolean> = {};

  constructor(
    private readonly userService: UserService,
    private readonly weatherService: WeatherService,
  ) {
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
      polling: true,
    });
    this.handleCommands();
  }

  private handleCommands() {
    this.bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      const firstName = msg.chat.first_name;

      this.bot.sendMessage(
        chatId,
        `Hello ${firstName}, welcome to the weather bot, you can use the following commands:
        /subscribe - to subscribe to get daily weather updates
        /unsubscribe - to unsubscribe from the bot 
        `,
      );
    });

    this.bot.onText(/\/subscribe/, async (msg) => {
      const chatId = msg.chat.id;

      const existingUser = await this.userService.findOne(chatId);

      if (existingUser) {
        return this.bot.sendMessage(chatId, 'You are already subscribed');
      }

      this.bot.sendMessage(
        chatId,
        'Send me your city name on which you want to get weather updates',
      );
      this.awaitingCityResponse[chatId] = true;
    });

    this.bot.on('text', async (msg) => {
      const chatId = msg.chat.id;
      const username = msg.chat.username;

      if (this.awaitingCityResponse[chatId]) {
        const city = msg.text;

        const user = await this.userService.create(chatId, username, city);

        if (!user) {
          return this.bot.sendMessage(chatId, 'Something went wrong');
        }

        this.bot.sendMessage(chatId, 'You have been subscribed');
        delete this.awaitingCityResponse[chatId];

        const weather = await this.weatherService.getWeather(user.city);

        if (weather instanceof NotFoundException) {
          return this.bot.sendMessage(chatId, 'Something went wrong');
        }

        this.bot.sendMessage(
          chatId,
          `Weather in ${weather.city} is ${weather.temperature}°C, ${weather.description}`,
        );
      }
    });

    this.bot.onText(/\/unsubscribe/, async (msg) => {
      const chatId = msg.chat.id;

      const existingUser = await this.userService.findOne(chatId);

      if (!existingUser) {
        return this.bot.sendMessage(chatId, 'You are not subscribed');
      }

      const deleteUser = await this.userService.deleteOne(chatId);
      if (!deleteUser) {
        return this.bot.sendMessage(chatId, 'Something went wrong');
      }
      this.bot.sendMessage(chatId, 'You have been unsubscribe');
    });
  }
}
