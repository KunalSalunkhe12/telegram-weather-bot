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
      this.sendMessage(chatId, 'Welcome to my awesome bot');
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
