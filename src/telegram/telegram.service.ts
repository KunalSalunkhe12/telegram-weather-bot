import { Injectable } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import { UserService } from '../user/user.service';
import { config } from 'dotenv';
config();

@Injectable()
export class TelegramService {
  private bot: TelegramBot;
  constructor(private readonly userService: UserService) {
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
      polling: true,
    });
    this.handleCommands();
  }

  private handleCommands() {
    this.bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      const firstName = msg.chat.first_name;
      console.log(msg);

      this.sendMessage(
        chatId,
        `Hello ${firstName}, welcome to the weather bot, you can use the following commands:
        /subscribe - to subscribe to get daily weather updates
        /unsubscribe - to unsubscribe from the bot 
        `,
      );
    });

    this.bot.onText(/\/subscribe/, async (msg) => {
      const chatId = msg.chat.id;
      const username = msg.chat.username;

      const existingUser = await this.userService.findOne(chatId);

      if (existingUser) {
        return this.sendMessage(chatId, 'You are already subscribed');
      }

      const user = await this.userService.create(chatId, username);

      if (!user) {
        return this.sendMessage(chatId, 'Something went wrong');
      }

      this.sendMessage(chatId, 'You have been subscribed');
    });

    this.bot.onText(/\/unsubscribe/, async (msg) => {
      const chatId = msg.chat.id;

      const existingUser = await this.userService.findOne(chatId);

      if (!existingUser) {
        return this.sendMessage(chatId, 'You are not subscribed');
      }

      const deleteUser = await this.userService.deleteOne(chatId);
      if (!deleteUser) {
        return this.sendMessage(chatId, 'Something went wrong');
      }
      this.sendMessage(chatId, 'You have been unsubscribe');
    });
  }

  sendMessage(chatId: number, message: string) {
    this.bot.sendMessage(chatId, message);
  }
}
