import { GridId } from './Grid';

export interface DailyWeather {
  gridId: GridId
  date: Date
  meanTemp: number
  precipitationMm: number
}