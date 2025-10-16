# Unit Testing Guide for C# Developers

This guide explains how unit testing works in this Next.js JavaScript project, with comparisons to C#/.NET testing practices.

## 🗂️ **Folder Structure**

```
📁 Project Root
├── lib/                           # Business logic to be tested
│   ├── repositories/
│   ├── services/
│   └── utils/
├── tests/                         # Test files
│   ├── lib/
│   │   ├── repositories/
│   │   │   ├── weatherDataRepository.test.js
│   │   │   └── weatherDataRepository.advanced.test.js
│   │   ├── services/
│   │   └── utils/
│   ├── helpers/
│   │   └── testHelpers.js        # Test utilities (like C# test helpers)
│   └── setup.js                  # Global test setup
├── jest.config.js                # Test configuration
└── package.json                  # Test scripts
```

## 🧪 **Testing Framework Comparison**

| C#/.NET | JavaScript/Jest | Purpose |
|---------|-----------------|---------|
| `[TestClass]` | `describe()` | Test class/group |
| `[TestMethod]` | `it()` or `test()` | Individual test |
| `[TestInitialize]` | `beforeEach()` | Setup before each test |
| `[TestCleanup]` | `afterEach()` | Cleanup after each test |
| `Assert.AreEqual()` | `expect().toBe()` | Assertions |
| `[ExpectedException]` | `expect().toThrow()` | Exception testing |
| Moq | `jest.fn()` | Mocking |

## 🚀 **Running Tests**

### **Basic Commands**
```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests for CI/CD
npm run test:ci
```

### **Run Specific Tests**
```bash
# Run tests matching a pattern
npm test -- weatherDataRepository

# Run tests in a specific file
npm test -- tests/lib/repositories/weatherDataRepository.test.js

# Run tests with specific name pattern
npm test -- --testNamePattern="should return"
```

## 📝 **Test Structure Example**

### **JavaScript/Jest**
```javascript
describe('WeatherDataRepository', () => {
  let repository;

  beforeEach(() => {
    repository = new WeatherDataRepository();
  });

  it('should return weather station for valid coordinates', async () => {
    // Arrange
    const latitude = 40.7128;
    const longitude = -74.0060;

    // Act
    const result = await repository.findNearestStation(latitude, longitude);

    // Assert
    expect(result).toBeDefined();
    expect(result.id).toBe('STATION_001');
  });
});
```

### **C# Equivalent**
```csharp
[TestClass]
public class WeatherDataRepositoryTests
{
    private WeatherDataRepository _repository;

    [TestInitialize]
    public void Setup()
    {
        _repository = new WeatherDataRepository();
    }

    [TestMethod]
    public async Task ShouldReturnWeatherStationForValidCoordinates()
    {
        // Arrange
        var latitude = 40.7128;
        var longitude = -74.0060;

        // Act
        var result = await _repository.FindNearestStationAsync(latitude, longitude);

        // Assert
        Assert.IsNotNull(result);
        Assert.AreEqual("STATION_001", result.Id);
    }
}
```

## 🎯 **Common Jest Assertions**

| Jest | C# Equivalent | Purpose |
|------|---------------|---------|
| `expect(value).toBe(expected)` | `Assert.AreEqual(expected, value)` | Exact equality |
| `expect(value).toEqual(expected)` | `Assert.AreEqual(expected, value)` | Deep equality |
| `expect(value).toBeDefined()` | `Assert.IsNotNull(value)` | Not null/undefined |
| `expect(value).toBeNull()` | `Assert.IsNull(value)` | Is null |
| `expect(array).toHaveLength(3)` | `Assert.AreEqual(3, array.Length)` | Array/collection length |
| `expect(obj).toHaveProperty('name')` | `Assert.IsTrue(obj.HasProperty("name"))` | Object has property |
| `expect(() => func()).toThrow()` | `Assert.ThrowsException<T>(() => func())` | Exception testing |

## 🔧 **Mocking (Similar to Moq in C#)**

### **JavaScript/Jest**
```javascript
it('should call external API', async () => {
  // Arrange
  const mockFetch = jest.fn().mockResolvedValue({
    json: () => Promise.resolve({ id: 'TEST' })
  });
  global.fetch = mockFetch;

  // Act
  await repository.findNearestStation(40, -74);

  // Assert
  expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/...');
});
```

### **C# with Moq**
```csharp
[TestMethod]
public async Task ShouldCallExternalApi()
{
    // Arrange
    var mockHttpClient = new Mock<IHttpClient>();
    mockHttpClient.Setup(x => x.GetAsync(It.IsAny<string>()))
              .ReturnsAsync(new HttpResponseMessage { Content = ... });

    // Act
    await repository.FindNearestStationAsync(40, -74);

    // Assert
    mockHttpClient.Verify(x => x.GetAsync("https://api.example.com/..."), Times.Once);
}
```

## 📊 **Coverage Reports**

After running `npm run test:coverage`, you'll see:

```
---------------------------------|---------|----------|---------|---------|-------------------
File                             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
---------------------------------|---------|----------|---------|---------|-------------------
weatherDataRepository.js        |     100 |      100 |     100 |     100 | 
```

- **% Stmts**: Statement coverage
- **% Branch**: Branch coverage (if/else)
- **% Funcs**: Function coverage
- **% Lines**: Line coverage

## 🎨 **Test Helpers and Utilities**

Use the helper functions in `tests/helpers/testHelpers.js`:

```javascript
import { createMockWeatherStation, testCoordinates } from '@/tests/helpers/testHelpers';

it('should handle mock data', () => {
  const station = createMockWeatherStation({ name: 'Test Station' });
  const coords = testCoordinates.newYork;
  
  expect(station.name).toBe('Test Station');
});
```

## 🏗️ **Best Practices**

### **1. Test Organization**
- Group related tests in `describe()` blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### **2. Test Data**
- Use test helpers for creating mock data
- Keep test data close to the test
- Use meaningful test values

### **3. Async Testing**
```javascript
// Good - properly handle async
it('should handle async operations', async () => {
  const result = await repository.findNearestStation(40, -74);
  expect(result).toBeDefined();
});

// Bad - missing async/await
it('should handle async operations', () => {
  const result = repository.findNearestStation(40, -74);
  expect(result).toBeDefined(); // This will fail!
});
```

### **4. Mocking External Dependencies**
- Mock external APIs, databases, file systems
- Reset mocks between tests
- Verify mock interactions

## 🔍 **Debugging Tests**

### **VS Code Integration**
1. Install "Jest" extension
2. Click the play button next to individual tests
3. Set breakpoints in test files
4. Use "Debug Test" from command palette

### **Console Output**
```javascript
it('should debug test', () => {
  console.log('Debug info:', someValue);
  expect(someValue).toBeDefined();
});
```

## 📈 **Test-Driven Development (TDD)**

1. **Red**: Write a failing test first
2. **Green**: Write minimal code to make it pass
3. **Refactor**: Improve the code while keeping tests green

```javascript
// 1. RED - Write failing test first
it('should calculate distance between stations', () => {
  const distance = station1.distanceTo(station2);
  expect(distance).toBeCloseTo(100.5, 1);
});

// 2. GREEN - Implement method to make test pass
// 3. REFACTOR - Improve implementation
```

This testing setup provides the same level of confidence and practices you're used to in C#, adapted for the JavaScript ecosystem!