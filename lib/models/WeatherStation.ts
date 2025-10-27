// Define types for better type safety
export type RainFallMeasurement = [Date, number];

export class WeatherStation {
  public id: number | null;
  public key: string;
  public name: string;
  public title: string;
  public latitude: number;
  public longitude: number;
  public active: boolean;
  public rainFallMeasurements: RainFallMeasurement[];

  constructor(data: Partial<WeatherStation> = {}) {
    this.id = data.id ?? null;
    this.key = data.key ?? '';
    this.name = data.name ?? '';
    this.title = data.title ?? '';
    this.latitude = data.latitude ?? 0;
    this.longitude = data.longitude ?? 0;
    this.active = data.active ?? true;
    this.rainFallMeasurements = data.rainFallMeasurements ?? [];
  }

  public static findClosestStation(
    stations: WeatherStation[],
    targetLatitude: number,
    targetLongitude: number
  ): WeatherStation | null {
    if (!stations || stations.length === 0) {
      return null;
    }

    let closest: WeatherStation | null = null;
    let minDistance: number = Number.MAX_VALUE;

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

  private static haversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371;
    const dLat = WeatherStation.degreesToRadians(lat2 - lat1);
    const dLon = WeatherStation.degreesToRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(WeatherStation.degreesToRadians(lat1)) * Math.cos(WeatherStation.degreesToRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static degreesToRadians(deg: number): number {
    return deg * (Math.PI / 180);
  }
}