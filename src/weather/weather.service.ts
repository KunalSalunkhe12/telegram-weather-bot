import { Injectable, NotFoundException } from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';

export type TWeather = {
  city: string;
  temperature: number;
  description: string;
};

@Injectable()
export class WeatherService {
  constructor(private readonly adminService: AdminService) {}

  async getWeather(city: string) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.adminService.getWeatherApiKey()}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    if (data.cod !== 200) {
      return new NotFoundException(data.message);
    }

    const weather = {
      city: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
    };

    return weather as TWeather;
  }
}
