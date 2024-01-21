import { Injectable } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import { config } from 'dotenv';
config();

@Injectable()
export class TelegramService {
  private bot: TelegramBot;
  constructor() {
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
      polling: true,
    });
    this.handleCommands();
  }

  private handleCommands() {
    this.bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      const firstName = msg.chat.first_name;

      this.sendMessage(
        chatId,
        `Hello ${firstName}, welcome to the weather bot, you can use the following commands:
        /subscribe - to subscribe to get daily weather updates
        /unsubscribe - to unsubscribe from the bot 
        `,
      );
    });

    this.bot.onText(/\/subscribe/, (msg) => {
      const chatId = msg.chat.id;
      this.sendMessage(chatId, 'You have been subscribed');
    });

    this.bot.onText(/\/unsubscribe/, (msg) => {
      const chatId = msg.chat.id;
      this.sendMessage(chatId, 'You have been unsubscribe');
    });
  }

  sendMessage(chatId: number, message: string) {
    this.bot.sendMessage(chatId, message);
  }
}
