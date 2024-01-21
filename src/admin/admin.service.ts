import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminService {
  private WEATHER_API_KEY = process.env.WEATHER_API_KEY;

  constructor(private readonly userService: UserService) {}

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
