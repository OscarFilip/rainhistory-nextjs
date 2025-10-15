import { WeatherDataRepository } from '@/lib/repositories/weatherDataRepository';
import { validateCoordinates } from '@/lib/utils/validation';

/**
 * Service for handling rain history operations
 */
export class RainHistoryService {
  constructor() {
    this.repository = new WeatherDataRepository();
  }

  /**
   * Get rainy days data for given coordinates
   * @param {number} latitude 
   * @param {number} longitude 
   * @returns {Promise<Object>} Rain history data
   */
  async getRainyDays(latitude, longitude) {
    // Validate input coordinates
    validateCoordinates(latitude, longitude);

    try {
      // Get station information
      const station = await this.repository.findNearestStation(latitude, longitude);
      
      if (!station) {
        throw new Error('No weather station found for these coordinates');
      }

      // Get rain data for the station
      const rainData = await this.repository.getRainDataByStation(station.id);

      // Process and format the data
      const processedData = this.processRainData(rainData);

      return {
        title: `Rain History for ${station.name}`,
        name: station.name,
        latitude: station.latitude,
        longitude: station.longitude,
        data: processedData
      };
    } catch (error) {
      console.error('Error in getRainyDays service:', error);
      throw error;
    }
  }

  /**
   * Process raw rain data
   * @param {Array} rawData 
   * @returns {Array} Processed rain data
   */
  processRainData(rawData) {
    return rawData
      .filter(record => record.rainFall > 0) // Only rainy days
      .map(record => ({
        date: record.date,
        rainFall: record.rainFall
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date desc
  }
}

// Export a convenience function for the API route
export async function getRainyDays(latitude, longitude) {
  const service = new RainHistoryService();
  return await service.getRainyDays(latitude, longitude);
}