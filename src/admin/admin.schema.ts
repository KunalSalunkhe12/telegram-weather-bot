import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Admin {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  weather_api_key: string;

  @Prop()
  bot_api_key: boolean;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
