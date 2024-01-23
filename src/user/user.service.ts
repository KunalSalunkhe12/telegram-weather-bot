import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(chat_id: number, username: string, city: string) {
    const createdUser = new this.userModel({ chat_id, username, city });
    return createdUser.save();
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findOne(chat_id: number) {
    return this.userModel.findOne({ chat_id }).exec();
  }

  async updateOne(chat_id: number, block: boolean) {
    return this.userModel
      .findOneAndUpdate({ chat_id }, { blocked: block }, { new: true })
      .exec();
  }

  async deleteOne(chat_id: number) {
    return this.userModel.deleteOne({ chat_id }).exec();
  }
}
