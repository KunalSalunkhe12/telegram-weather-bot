import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { Admin } from './admin.schema';

@Injectable()
export class AdminService {
  private WEATHER_API_KEY = process.env.WEATHER_API_KEY;

  constructor(
    @InjectModel('Admin') private readonly adminModel: Model<Admin>,
    private readonly userService: UserService,
  ) {}

  async createAdmin(sub: string, email: string, name: string) {
    const existingAdmin = await this.adminModel.findOne({ sub });
    if (existingAdmin) {
      return existingAdmin;
    }
    const createdAdmin = await this.adminModel.create({ sub, email, name });
    return createdAdmin;
  }

  async setWeatherApiKey(key: string, sub: string) {
    const admin = await this.adminModel.findOneAndUpdate(
      { sub },
      { weather_api_key: key },
      { new: true },
    );
    return admin;
  }

  getWeatherApiKey() {
    return this.WEATHER_API_KEY;
  }

  async getUsers() {
    return this.userService.findAll();
  }
}
