import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  async createAdmin(
    @Body('email') email: string,
    @Body('name') name: string,
    @Body('sub') sub: string,
  ) {
    try {
      const admin = await this.adminService.createAdmin(sub, email, name);
      if (admin) {
        return admin;
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Put('weather-api-key')
  async setWeatherApiKey(
    @Body('weatherApiKey') weatherApiKey: string,
    @Body('sub') sub: string,
  ) {
    try {
      const admin = await this.adminService.updateAdminWeatherApiKey(
        weatherApiKey,
        sub,
      );
      if (admin) {
        return admin;
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Get('users')
  async getUsers() {
    try {
      const users = await this.adminService.getUsers();
      if (users) {
        return users;
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Put('users/:chat_id')
  async blockUser(
    @Param('chat_id') chat_id: number,
    @Body('blocked') blocked: boolean,
  ) {
    try {
      await this.adminService.blockUser(chat_id, blocked);
      return 'User blocked';
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Delete('users/:chat_id')
  async deleteUser(@Param('chat_id') chat_id: number) {
    try {
      await this.adminService.deleteUser(chat_id);
      return 'User deleted';
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
