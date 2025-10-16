/**
 * Test helper utilities
 * Similar to helper methods you might have in C# test projects
 */

/**
 * Create mock weather station data
 * @param {Object} overrides - Properties to override
 * @returns {Object} Mock weather station
 */
export function createMockWeatherStation(overrides = {}) {
  return {
    id: 'MOCK_STATION_001',
    name: 'Mock Weather Station',
    latitude: 40.7128,
    longitude: -74.0060,
    elevation: 100,
    ...overrides
  };
}

/**
 * Create mock rain record data
 * @param {Object} overrides - Properties to override
 * @returns {Object} Mock rain record
 */
export function createMockRainRecord(overrides = {}) {
  return {
    id: 1,
    stationId: 'MOCK_STATION_001',
    date: '2023-10-15',
    rainFall: 10.5,
    temperature: 18.2,
    humidity: 65,
    ...overrides
  };
}

/**
 * Create array of mock rain records
 * @param {number} count - Number of records to create
 * @param {Object} baseOverrides - Base properties to override
 * @returns {Array} Array of mock rain records
 */
export function createMockRainRecords(count = 5, baseOverrides = {}) {
  const records = [];
  const today = new Date();
  
  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    records.push(createMockRainRecord({
      id: i + 1,
      date: date.toISOString().split('T')[0],
      rainFall: Math.random() * 50,
      ...baseOverrides
    }));
  }
  
  return records;
}

/**
 * Assert that an object has the expected structure
 * @param {Object} obj - Object to validate
 * @param {Array} expectedProperties - Array of property names
 */
export function assertObjectStructure(obj, expectedProperties) {
  expect(obj).toBeDefined();
  expect(obj).not.toBeNull();
  
  expectedProperties.forEach(property => {
    expect(obj).toHaveProperty(property);
  });
}

/**
 * Generate test coordinates for different scenarios
 */
export const testCoordinates = {
  // Major cities
  newYork: { latitude: 40.7128, longitude: -74.0060 },
  london: { latitude: 51.5074, longitude: -0.1278 },
  tokyo: { latitude: 35.6762, longitude: 139.6503 },
  sydney: { latitude: -33.8688, longitude: 151.2093 },
  
  // Edge cases
  northPole: { latitude: 90, longitude: 0 },
  southPole: { latitude: -90, longitude: 0 },
  equatorPrimeMeridian: { latitude: 0, longitude: 0 },
  
  // Invalid coordinates (for error testing)
  invalid: [
    { latitude: 91, longitude: 0 },    // Invalid latitude
    { latitude: 0, longitude: 181 },   // Invalid longitude
    { latitude: null, longitude: 0 },  // Null latitude
    { latitude: 0, longitude: null },  // Null longitude
  ]
};

/**
 * Wait for a specified amount of time (for testing async operations)
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after the specified time
 */
export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create a spy function (similar to Moq in C#)
 * @param {Function} implementation - Optional implementation
 * @returns {Function} Jest spy function
 */
export function createSpy(implementation) {
  return jest.fn(implementation);
}