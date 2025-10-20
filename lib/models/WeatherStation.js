export class WeatherStation {
  constructor(data = {}) {
    this.id = data.id || null;
    this.key = data.key || '';
    this.name = data.name || '';
    this.title = data.title || '';
    this.latitude = data.latitude || 0;
    this.longitude = data.longitude || 0;
    this.active = data.active ?? true;
    this.rainFallMeasurements = data.rainFallMeasurements || [];
  }

  static findClosestStation(stations, targetLatitude, targetLongitude) {
    if (!stations || stations.length === 0) {
      return null;
    }

    let closest = null;
    let minDistance = Number.MAX_VALUE;

    for (const station of stations) {
      const distance = WeatherStation.haversineDistance(
        targetLatitude,
        targetLongitude,
        station.latitude,
        station.longitude
      );

      if (distance < minDistance) {
        minDistance = distance;
        closest = station;
      }
    }

    return closest;
  }

  static haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = WeatherStation.degreesToRadians(lat2 - lat1);
    const dLon = WeatherStation.degreesToRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(WeatherStation.degreesToRadians(lat1)) * Math.cos(WeatherStation.degreesToRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  static degreesToRadians(deg) {
    return deg * (Math.PI / 180);
  }
}