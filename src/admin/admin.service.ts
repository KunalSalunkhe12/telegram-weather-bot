import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { Admin } from './admin.schema';

@Injectable()
export class AdminService {
  private WEATHER_API_KEY: string;
  private readonly ADMIN_DEFAULT_SUB = '101923507672479597871';

  constructor(
    @InjectModel('Admin') private readonly adminModel: Model<Admin>,
    private readonly userService: UserService,
  ) {
    this.setWeatherApiKey(this.ADMIN_DEFAULT_SUB);
  }

  async createAdmin(sub: string, email: string, name: string) {
    const existingAdmin = await this.adminModel.findOne({ sub });
    if (existingAdmin) {
      return existingAdmin;
    }
    const createdAdmin = await this.adminModel.create({ sub, email, name });
    return createdAdmin;
  }

  async updateAdminWeatherApiKey(newKey: string, sub: string) {
    const admin = await this.adminModel.findOneAndUpdate(
      { sub },
      { weather_api_key: newKey },
      { new: true },
    );
    this.setWeatherApiKey(sub);
    return admin.weather_api_key;
  }

  async setWeatherApiKey(sub: string) {
    const admin = await this.adminModel.findOne({ sub });
    this.WEATHER_API_KEY = admin.weather_api_key;
  }

  getWeatherApiKey(): string {
    return this.WEATHER_API_KEY;
  }

  async getUsers() {
    return this.userService.findAll();
  }

  async blockUser(chat_id: number, blocked: boolean) {
    return this.userService.updateOne(chat_id, blocked);
  }

  async deleteUser(chat_id: number) {
    return this.userService.deleteOne(chat_id);
  }
}
