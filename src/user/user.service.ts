import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(chat_id: number, username: string) {
    const createdUser = new this.userModel({ chat_id, username });
    return createdUser.save();
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findOne(chat_id: number) {
    return this.userModel.findOne({ chat_id }).exec();
  }
}
