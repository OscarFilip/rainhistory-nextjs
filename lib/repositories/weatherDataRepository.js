import { ApiClient } from './apiClient.js';

export class WeatherDataRepository {
  constructor() {
    this.baseUrl = 'https://opendata-download-metobs.smhi.se/api'
    this.version = 'latest';
    this.parameter = '7';
    this.period = 'latest-months';
    this.apiClient = new ApiClient('https://opendata-download-metobs.smhi.se/api');
  }

  async getAvailableStationsAsync() {
    const url = `/version/${this.version}/parameter/${this.parameter}.json`;
    return await this.apiClient.get(url);
  }

  async getDailyRainAmountsLast3MonthsAsync(station = {}) {
    const key = station.key;
    const url = `/version/${this.version}/parameter/${this.parameter}/station/${key}/period/${this.period}/data.csv`;

    try {
      // Get raw CSV text
      const csvText = await this.apiClient.getText(url);
      
      // Parse the CSV and aggregate daily rainfall
      const dailyRain = new Map();
      const lines = csvText.split('\n');
      let dataSection = false;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today
      const threeMonthsAgo = new Date(today);
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      for (const line of lines) {
        // Robust header detection
        if (!dataSection) {
          const trimmed = line.trim().replace('\uFEFF', ''); // Remove BOM if present
          if (trimmed.startsWith('Datum;Tid (UTC);Nederbördsmängd')) {
            dataSection = true;
            continue; // skip header row
          }
          continue;
        }

        const columns = line.split(';');
        if (columns.length < 3) continue;

        // Parse date and rainfall
        const dateStr = columns[0]?.trim();
        const rainfallStr = columns[2]?.trim();
        
        if (!dateStr || !rainfallStr) continue;

        const date = new Date(dateStr);
        const rainfall = parseFloat(rainfallStr);

        // Validate parsing
        if (isNaN(date.getTime()) || isNaN(rainfall)) continue;

        // Filter by date range (last 3 months)
        if (date >= threeMonthsAgo && date <= today) {
          // Create date key (YYYY-MM-DD format)
          const dateKey = date.toISOString().split('T')[0];
          
          if (!dailyRain.has(dateKey)) {
            dailyRain.set(dateKey, 0);
          }
          dailyRain.set(dateKey, dailyRain.get(dateKey) + rainfall);
        }
      }

      // Convert to sorted array of [date, rainfall] tuples
      const sortedRain = Array.from(dailyRain.entries())
        .map(([dateStr, rainfall]) => [new Date(dateStr), rainfall])
        .sort((a, b) => a[0] - b[0]);

      // Update station with measurements
      station.rainFallMeasurements = sortedRain;
      return station;

    } catch (error) {
      console.error(`Failed to fetch or parse daily rain amounts for station ${key}:`, error);
      return station; // Return station without measurements on error
    }
  }
}