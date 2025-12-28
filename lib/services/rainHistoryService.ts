import { WeatherDataRepository } from '../repositories/weatherDataRepository';
import { WeatherStation } from '../models/WeatherStation';
import { validateCoordinates } from '../utils/validation';

interface WeatherDataResponse {
  rainStation: {
    id: number | null;
    key: string;
    name: string;
    title: string;
    latitude: number;
    longitude: number;
    active: boolean;
    rainFallMeasurements: Array<{
      date: string; // ISO string instead of Date object
      rainFall: number;
    }>;
  } | null;
  temperatureStation: {
    id: number | null;
    key: string;
    name: string;
    title: string;
    latitude: number;
    longitude: number;
    active: boolean;
    temperatureMeasurements: Array<{
      date: string; // ISO string instead of Date object
      temperature: number;
    }>;
  } | null;
}

// TODO: Change this function to get rain and temp data.
// Rename to 'getHistoricalWeatherData'?
export async function getHistoricalWeatherData(latitude: number, longitude: number): Promise<WeatherDataResponse> {
  const repository = new WeatherDataRepository();
  
  try {
    // Get stations for both parameters separately
    const [rainfallStationsData, temperatureStationsData] = await Promise.all([
      repository.getAvailableStationsAsync(WeatherDataRepository.PARAMETER_RAINFALL),
      repository.getAvailableStationsAsync(WeatherDataRepository.PARAMETER_TEMPERATURE)
    ]);

    if ((!rainfallStationsData?.station || rainfallStationsData.station.length === 0) &&
        (!temperatureStationsData?.station || temperatureStationsData.station.length === 0)) {
      throw new Error('No weather stations available');
    }

    // Create station objects for rainfall
    const rainfallStations = rainfallStationsData?.station?.map(stationData => 
      new WeatherStation({
        id: stationData.id,
        key: stationData.key,
        name: stationData.name,
        title: stationData.title,
        latitude: stationData.latitude,
        longitude: stationData.longitude,
        active: stationData.active
      })
    ) || [];

    // Create station objects for temperature
    const temperatureStations = temperatureStationsData?.station?.map(stationData => 
      new WeatherStation({
        id: stationData.id,
        key: stationData.key,
        name: stationData.name,
        title: stationData.title,
        latitude: stationData.latitude,
        longitude: stationData.longitude,
        active: stationData.active
      })
    ) || [];

    // Find closest stations for each parameter
    const closestRainfallStation = rainfallStations.length > 0 
      ? WeatherStation.findClosestStation(rainfallStations, latitude, longitude)
      : null;
    
    const closestTemperatureStation = temperatureStations.length > 0
      ? WeatherStation.findClosestStation(temperatureStations, latitude, longitude)
      : null;

    if (!closestRainfallStation && !closestTemperatureStation) {
      throw new Error('No nearby weather stations found');
    }

    // Get data for each station independently
    const dataPromises = [];
    let rainStation: WeatherStation | null = null;
    let temperatureStation: WeatherStation | null = null;

    if (closestRainfallStation) {
      dataPromises.push(
        repository.getDailyRainAmountsLast3MonthsAsync(closestRainfallStation)
          .then(station => { rainStation = station; })
          .catch(error => {
            console.warn('Failed to get rainfall data:', error);
          })
      );
    }

    if (closestTemperatureStation) {
      dataPromises.push(
        repository.getDailyAverageTemperatureLast3MonthsAsync(closestTemperatureStation)
          .then(station => { temperatureStation = station; })
          .catch(error => {
            console.warn('Failed to get temperature data:', error);
          })
      );
    }

    await Promise.all(dataPromises);

    // Check if we got any data at all
    if (!rainStation && !temperatureStation) {
      throw new Error('Failed to retrieve any weather data from available stations');
    }

    return {
      rainStation,
      temperatureStation
    };

  } catch (error) {
    console.error('Error in getHistoricalWeatherData:', error);
    throw error;
  }
}