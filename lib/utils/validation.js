/**
 * Validation utilities
 */

/**
 * Validate latitude and longitude coordinates
 * @param {number} latitude 
 * @param {number} longitude 
 * @throws {Error} If coordinates are invalid
 */
export function validateCoordinates(latitude, longitude) {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    throw new Error('Latitude and longitude must be numbers');
  }

  if (latitude < -90 || latitude > 90) {
    throw new Error('Latitude must be between -90 and 90 degrees');
  }

  if (longitude < -180 || longitude > 180) {
    throw new Error('Longitude must be between -180 and 180 degrees');
  }
}

/**
 * Validate date string
 * @param {string} dateString 
 * @returns {boolean} True if valid date
 */
export function isValidDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}