import { WeatherStation } from '../models/WeatherStation';
import { ApiClient } from './apiClient';

interface StationsResponse {
  station: Array<{
    id: number;
    key: string;
    name: string;
    title: string;
    latitude: number;
    longitude: number;
    active: boolean;
  }>;
}

export class WeatherDataRepository {
  private version: string;
  private parameter: string;
  private period: string;
  private apiClient: ApiClient;

  constructor() {
    this.version = 'latest';
    this.parameter = '7';
    this.period = 'latest-months';
    this.apiClient = new ApiClient('https://opendata-download-metobs.smhi.se/api');
  }

  public async getAvailableStationsAsync(): Promise<StationsResponse> {
    const url = `/version/${this.version}/parameter/${this.parameter}.json`;
    return await this.apiClient.get<StationsResponse>(url);
  }

  public async getDailyRainAmountsLast3MonthsAsync(station: WeatherStation): Promise<WeatherStation> {
    const key = station.key;
    const url = `/version/${this.version}/parameter/${this.parameter}/station/${station.key}/period/${this.period}/data.csv`;

    try {
      const csvText = await this.apiClient.getText(url);
      
      const dailyRain = new Map<string, number>();
      const lines = csvText.split('\n');
      let dataSection = false;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const threeMonthsAgo = new Date(today);
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      for (const line of lines) {
        if (!dataSection) {
          const trimmed = line.trim().replace('\uFEFF', '');
          if (trimmed.startsWith('Datum;Tid (UTC);Nederbördsmängd')) {
            dataSection = true;
            continue;
          }
          continue;
        }

        const columns = line.split(';');
        if (columns.length < 3) continue;

        const dateStr = columns[0]?.trim();
        const rainfallStr = columns[2]?.trim();
        
        if (!dateStr || !rainfallStr) continue;

        const date = new Date(dateStr);
        const rainfall = parseFloat(rainfallStr);

        if (isNaN(date.getTime()) || isNaN(rainfall)) continue;

        if (date >= threeMonthsAgo && date <= today) {
          const dateKey = date.toISOString().split('T')[0];
          
          if (!dailyRain.has(dateKey)) {
            dailyRain.set(dateKey, 0);
          }
          dailyRain.set(dateKey, dailyRain.get(dateKey)! + rainfall);
        }
      }

      const mappedEntries: Array<[Date, number]> = Array.from(dailyRain.entries())
        .map(([dateStr, rainfall]) => [new Date(dateStr), rainfall] as [Date, number]);

      const sortedRain: Array<[Date, number]> = mappedEntries
        .sort((a, b) => a[0].getTime() - b[0].getTime());
        
      station.rainFallMeasurements = sortedRain;
      return station;

    } catch (error) {
      console.error(`Failed to fetch or parse daily rain amounts for station ${key}:`, error);
      return station;
    }
  }
}