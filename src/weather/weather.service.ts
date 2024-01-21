import { Injectable, NotFoundException } from '@nestjs/common';

export type TWeather = {
  city: string;
  temperature: number;
  description: string;
};

@Injectable()
export class WeatherService {
  async getWeather(city: string) {
    console.log(city);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();

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
