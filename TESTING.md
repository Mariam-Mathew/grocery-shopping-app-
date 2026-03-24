# 🧪 Testing Guide

This document provides comprehensive information about the testing setup and practices for the Grocery Shopping App.

## 📋 Overview

The project uses **Jest** as the test runner with **React Native Testing Library** for component testing. The testing setup is configured to work seamlessly with React Native and Expo applications.

## 🛠️ Testing Stack

- **Test Runner**: Jest
- **Testing Library**: React Native Testing Library
- **Mocking**: Jest mocks for React Native and Expo modules
- **Coverage**: Built-in Jest coverage reporting
- **TypeScript**: Full TypeScript support

## 📁 Test Structure

```
__tests__/
├── basic.test.ts           # Basic utility tests
├── components.test.tsx     # Component logic tests
└── [future tests...]       # Additional test files
```

## 🚀 Available Scripts

### Run Tests
```bash
# Run all tests once
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run tests for CI/CD (no watch, with coverage)
npm run test:ci
```

## 📊 Current Test Coverage

The current test suite includes:

### ✅ Working Tests
- **Basic Tests**: Utility functions and basic logic
- **Component Logic Tests**: Shopping cart calculations, theme switching
- **Business Logic**: Price calculations, data transformations

### 📈 Coverage Report
Run `npm run test:coverage` to see detailed coverage statistics. The coverage report is generated in the `coverage/` directory with an HTML report at `coverage/lcov-report/index.html`.

## 🔧 Configuration

### Jest Configuration (`jest.config.js`)
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./jest.setup.js'],
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)',
  ],
  // ... other configurations
};
```

### Setup File (`jest.setup.js`)
The setup file includes:
- React Native globals (`__DEV__`)
- Mocks for Expo modules (Constants, Font, SplashScreen)
- AsyncStorage mock for data persistence testing
- Platform-specific module handling

## 📝 Writing Tests

### Basic Test Structure
```typescript
describe('Test Suite Name', () => {
  it('should test specific functionality', () => {
    // Arrange
    const testData = { /* test data */ };
    
    // Act
    const result = someFunction(testData);
    
    // Assert
    expect(result).toBe(expectedValue);
  });
});
```

### Best Practices

#### 1. Test Business Logic
```typescript
it('should calculate shopping cart total correctly', () => {
  const cartItems = [
    { id: 1, name: 'Apple', price: 1.99, quantity: 2 },
    { id: 2, name: 'Bread', price: 3.49, quantity: 1 },
  ];

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  expect(total).toBeCloseTo(7.47, 2);
});
```

#### 2. Test Component Logic
```typescript
it('should handle theme switching logic', () => {
  const isDarkMode = false;
  const theme = isDarkMode ? 'dark' : 'light';
  
  expect(theme).toBe('light');
});
```

#### 3. Test Edge Cases
```typescript
it('should handle empty cart', () => {
  const cartItems = [];
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  expect(total).toBe(0);
});
```

## 🎯 Testing Guidelines

### What to Test
- ✅ **Business Logic**: Calculations, data transformations
- ✅ **Component Logic**: State management, event handlers
- ✅ **Utility Functions**: Pure functions, helpers
- ✅ **User Interactions**: Form submissions, navigation
- ✅ **Edge Cases**: Empty states, error conditions

### What NOT to Test
- ❌ **External Libraries**: Assume they work correctly
- ❌ **Styling**: Visual appearance (use visual testing instead)
- ❌ **Platform APIs**: Mock them instead
- ❌ **Implementation Details**: Focus on behavior, not internals

## 🔍 Common Testing Patterns

### 1. Async Operations
```typescript
it('should handle async operations', async () => {
  const result = await Promise.resolve('hello');
  expect(result).toBe('hello');
});
```

### 2. Floating Point Comparisons
```typescript
it('should handle financial calculations', () => {
  const price = 1.99;
  const quantity = 2;
  const total = price * quantity;
  
  expect(total).toBeCloseTo(3.98, 2);
});
```

### 3. Array Operations
```typescript
it('should filter items correctly', () => {
  const items = [
    { id: 1, category: 'produce' },
    { id: 2, category: 'dairy' },
    { id: 3, category: 'produce' },
  ];
  
  const produceItems = items.filter(item => item.category === 'produce');
  expect(produceItems).toHaveLength(2);
});
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Module Resolution Errors
```bash
Cannot find module 'react-native'
```
**Solution**: Ensure `jest.setup.js` properly mocks React Native modules.

#### 2. Floating Point Precision
```bash
Expected: 7.47, Received: 7.470000000000001
```
**Solution**: Use `toBeCloseTo()` instead of `toBe()` for financial calculations.

#### 3. Async Test Timeouts
```bash
Timeout - Async callback was not invoked
```
**Solution**: Ensure async tests use `await` or return promises.

### Debugging Tests

#### 1. Console Logging
```typescript
it('should debug test values', () => {
  const data = { value: 42 };
  console.log('Debug data:', data);
  expect(data.value).toBe(42);
});
```

#### 2. Test Only One Test
```typescript
it.only('should run only this test', () => {
  // This test will run exclusively
});
```

#### 3. Skip Tests
```typescript
it.skip('should skip this test', () => {
  // This test will be skipped
});
```

## 📈 Future Testing Enhancements

### Planned Additions
1. **Component Integration Tests**: Full component rendering and interaction
2. **E2E Testing**: Complete user journey testing
3. **Visual Regression Testing**: UI consistency checks
4. **Performance Testing**: Component rendering performance
5. **Accessibility Testing**: Screen reader and accessibility compliance

### Test Files to Add
- `ShoppingContext.test.tsx` - Context provider testing
- `Themed.test.tsx` - Theme component testing
- `App.test.tsx` - App integration testing

## 📚 Resources

### Documentation
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Expo Testing Guide](https://docs.expo.dev/guides/testing/)

### Best Practices
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Test-Driven Development](https://martinfowler.com/articles/bdd-in-action.html)

## 🤝 Contributing to Tests

When adding new features:
1. **Write tests first** (TDD approach when possible)
2. **Test both happy path and edge cases**
3. **Maintain high coverage** (aim for 70%+)
4. **Update documentation** for new test patterns
5. **Run full test suite** before committing

## 📞 Support

For testing-related questions:
1. Check this documentation
2. Review existing test files for patterns
3. Consult Jest and Testing Library documentation
4. Create an issue for specific testing challenges

---

**Happy Testing! 🧪**
