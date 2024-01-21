import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import { UserService } from '../user/user.service';
import { config } from 'dotenv';
import { WeatherService } from 'src/weather/weather.service';
config();

@Injectable()
export class TelegramService {
  private logger = new Logger(TelegramService.name);
  private bot: TelegramBot;
  private awaitingCityResponse: Record<string, boolean> = {};

  constructor(
    private readonly userService: UserService,
    private readonly weatherService: WeatherService,
  ) {
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
      polling: true,
    });
    this.handleCommands();
    setInterval(() => this.sendWeatherUpdates(), 1000 * 60);
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

      try {
        const existingUser = await this.userService.findOne(chatId);

        if (existingUser) {
          return this.bot.sendMessage(chatId, 'You are already subscribed');
        }

        this.bot.sendMessage(
          chatId,
          'Send me your city name on which you want to get weather updates',
        );
        this.awaitingCityResponse[chatId] = true;
      } catch (error) {
        this.bot.sendMessage(chatId, 'Something went wrong');
        this.logger.error(error);
      }
    });

    this.bot.on('text', async (msg) => {
      const chatId = msg.chat.id;
      const username = msg.chat.username;

      try {
        if (this.awaitingCityResponse[chatId]) {
          const city = msg.text;

          const weather = await this.weatherService.getWeather(city);
          if (weather instanceof NotFoundException) {
            return this.bot.sendMessage(
              chatId,
              'Something went wrong, Enter a valid city name',
            );
          }

          const user = await this.userService.create(chatId, username, city);

          if (!user) {
            return this.bot.sendMessage(chatId, 'Something went wrong');
          }

          this.bot.sendMessage(chatId, 'You have been subscribed');
          delete this.awaitingCityResponse[chatId];

          this.bot.sendMessage(
            chatId,
            `Weather in ${weather.city} is ${weather.temperature}°C, ${weather.description}`,
          );
        }
      } catch (error) {
        this.bot.sendMessage(chatId, 'Something went wrong');
        this.logger.error(error);
      }
    });

    this.bot.onText(/\/unsubscribe/, async (msg) => {
      const chatId = msg.chat.id;

      try {
        const existingUser = await this.userService.findOne(chatId);

        if (!existingUser) {
          return this.bot.sendMessage(chatId, 'You are not subscribed');
        }

        const deleteUser = await this.userService.deleteOne(chatId);
        if (!deleteUser) {
          return this.bot.sendMessage(chatId, 'Something went wrong');
        }
        this.bot.sendMessage(chatId, 'You have been unsubscribe');
      } catch (error) {
        this.bot.sendMessage(chatId, 'Something went wrong');
        this.logger.error(error);
      }
    });
  }

  private async sendWeatherUpdates() {
    try {
      const users = await this.userService.findAll();

      const promises = users.map(async (user) => {
        const weather = await this.weatherService.getWeather(user.city);

        if (weather instanceof NotFoundException) {
          return this.bot.sendMessage(user.chat_id, 'Something went wrong');
        }

        return this.bot.sendMessage(
          user.chat_id,
          `Weather in ${weather.city} is ${weather.temperature}°C, ${weather.description}`,
        );
      });

      await Promise.all(promises);
    } catch (error) {
      console.log(error);
      this.logger.error(error);
    }
  }
}
