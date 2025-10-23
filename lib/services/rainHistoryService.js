import { WeatherDataRepository } from '../repositories/weatherDataRepository.js';
import { WeatherStation } from '../models/WeatherStation.ts';
import { validateCoordinates } from '../utils/validation.js';

export class RainHistoryService {
  constructor() {
    this.repository = new WeatherDataRepository();
  }

  async getRainyDays(latitude, longitude) {
    try {
      validateCoordinates(latitude,longitude)

      // Get all available stations from the repository
      const stationsData = await this.repository.getAvailableStationsAsync();
      
      if (!stationsData?.station || stationsData.station.length === 0) {
        throw new Error('No weather stations available');
      }

      // Convert to WeatherStation model instances
      const stations = stationsData.station.map(stationData => 
        new WeatherStation({
          id: stationData.id,
          key: stationData.key,
          name: stationData.name,
          title: stationData.title,
          latitude: stationData.latitude,
          longitude: stationData.longitude,
          active: stationData.active
        })
      );

      // Use domain logic to find closest station
      const closestStation = WeatherStation.findClosestStation(stations, latitude, longitude);
      
      if (!closestStation) {
        throw new Error('No nearby weather station found');
      }

      // Get rainfall data for the closest station
      const stationWithRainfall = await this.repository.getDailyRainAmountsLast3MonthsAsync(closestStation);
      
      // Transform for API response
      const rainData = {
        id: stationWithRainfall.id,
        key: stationWithRainfall.key,
        name: stationWithRainfall.name,
        title: stationWithRainfall.title,
        latitude: stationWithRainfall.latitude,
        longitude: stationWithRainfall.longitude,
        active: stationWithRainfall.active,
        rainFallMeasurements: stationWithRainfall.rainFallMeasurements?.map(([date, rainfall]) => ({
          date: date,
          rainFall: rainfall
        })) || []
      };

      return rainData;

    } catch (error) {
      console.error('Error in RainHistoryService.getRainyDays:', error);
      throw error;
    }
  }
}

// Export a convenience function for the API route
export async function getRainyDays(latitude, longitude) {
  const service = new RainHistoryService();
  return await service.getRainyDays(latitude, longitude);
}