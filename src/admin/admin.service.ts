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
    const createdAdmin = new this.adminModel({ sub, email, name });
    return createdAdmin.save();
  }

  setWeatherApiKey(key: string) {
    this.WEATHER_API_KEY = key;
  }

  getWeatherApiKey() {
    return this.WEATHER_API_KEY;
  }

  async getUsers() {
    return this.userService.findAll();
  }
}
