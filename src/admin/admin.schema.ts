import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Admin {
  @Prop({ required: true })
  sub: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  weather_api_key: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
