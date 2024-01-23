import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
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
      const admin = await this.adminService.createAdmin(email, name, sub);
      if (admin) {
        return admin;
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}