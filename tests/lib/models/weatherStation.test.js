import { WeatherStation } from '@/lib/models/WeatherStation';

describe('WeatherStation', () => {
  
  describe('findClosestStation', () => {
    it('should find the closest station from a list of stations', () => {
      // Arrange
      const stations = [
        new WeatherStation({
          id: 1,
          name: 'Station A',
          latitude: 40.0,
          longitude: -74.0
        }),
        new WeatherStation({
          id: 2,
          name: 'Station B', 
          latitude: 41.0,
          longitude: -73.0
        }),
        new WeatherStation({
          id: 3,
          name: 'Station C',
          latitude: 40.1,
          longitude: -74.1
        })
      ];
      
      const targetLatitude = 40.05;
      const targetLongitude = -74.05;

      // Act
      const result = WeatherStation.findClosestStation(stations, targetLatitude, targetLongitude);

      // Assert
      expect(result).not.toBeNull();
      expect(result.id).toBe(3);
      expect(result.name).toBe('Station C');
    });

    it('should return null when stations array is empty or null', () => {
      // Arrange
      const targetLatitude = 40.0;
      const targetLongitude = -74.0;

      // Act & Assert
      expect(WeatherStation.findClosestStation([], targetLatitude, targetLongitude)).toBeNull();
      expect(WeatherStation.findClosestStation(null, targetLatitude, targetLongitude)).toBeNull();
      expect(WeatherStation.findClosestStation(undefined, targetLatitude, targetLongitude)).toBeNull();
    });
  });

  describe('haversineDistance', () => {
    it('should calculate correct distance between two points', () => {
      // Arrange - Arlanda Airport to Landvetter Airport (approximate distance: ~381 km)
      const lat1 = 59.6498;  // Arlanda Airport
      const lon1 = 17.9344;
      const lat2 = 57.6690;  // Landvetter Airport
      const lon2 = 12.2914;

      // Act
      const distance = WeatherStation.haversineDistance(lat1, lon1, lat2, lon2);

      // Assert
      expect(distance).toBeCloseTo(394, 0); // Within 1km accuracy
    });

    it('should return zero distance for identical coordinates', () => {
      // Arrange
      const lat = 59.6498;
      const lon = 17.9344;

      // Act
      const distance = WeatherStation.haversineDistance(lat, lon, lat, lon);

      // Assert
      expect(distance).toBe(0);
    });
  });

});
