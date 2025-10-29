import { WeatherDataRepository } from '../repositories/weatherDataRepository';
import { WeatherStation } from '../models/WeatherStation';
import { validateCoordinates } from '../utils/validation';

interface RainDataResponse {
  id: number | null;
  key: string;
  name: string;
  title: string;
  latitude: number;
  longitude: number;
  active: boolean;
  rainFallMeasurements: Array<{
    date: Date;
    rainFall: number;
  }>;
}

export async function getRainyDays(latitude: number, longitude: number): Promise<RainDataResponse> {
  const repository = new WeatherDataRepository();
  
  try {
    validateCoordinates(latitude, longitude);

    const stationsData = await repository.getAvailableStationsAsync();
    
    if (!stationsData?.station || stationsData.station.length === 0) {
      throw new Error('No weather stations available');
    }

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

    const closestStation = WeatherStation.findClosestStation(stations, latitude, longitude);
    
    if (!closestStation) {
      throw new Error('No nearby weather station found');
    }

    const stationWithRainfall = await repository.getDailyRainAmountsLast3MonthsAsync(closestStation);
    
    return {
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

  } catch (error) {
    console.error('Error in getRainyDays:', error);
    throw error;
  }
}