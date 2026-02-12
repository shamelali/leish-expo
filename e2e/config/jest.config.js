/**
 * E2E Tests Configuration
 * Jest configuration for E2E tests
 */

module.exports = {
  preset: 'detox/runners/jest',
  testEnvironment: 'detox/runners/jest/streamlineTestEnvironment',
  testRunner: 'jest-circus/runner',
  testTimeout: 120000,
  reporters: ['detox/runners/jest/streamlineReporter'],
  verbose: true,
};
