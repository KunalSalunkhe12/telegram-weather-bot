import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ required: true })
  chat_id: number;

  @Prop()
  username: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true, default: false })
  blocked: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
