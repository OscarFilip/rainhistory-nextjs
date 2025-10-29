export function validateCoordinates(latitude: number, longitude: number) {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    throw new Error('Latitude and longitude must be numbers');
  }

  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error('Latitude and longitude must be valid numbers');
  }

  if (latitude < -90 || latitude > 90) {
    throw new Error('Latitude must be between -90 and 90 degrees');
  }

  if (longitude < -180 || longitude > 180) {
    throw new Error('Longitude must be between -180 and 180 degrees');
  }
}