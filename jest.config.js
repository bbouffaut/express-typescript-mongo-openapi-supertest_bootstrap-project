/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  coverageProvider: "v8",
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],

  moduleNameMapper: {
    "@meteo-france-api/(.*)": "<rootDir>/src/$1"
  },

  roots: ["<rootDir>/src"],

  testMatch: ["**/__tests__/**/*.test.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  transform: {
    "^.*\\.(ts|tsx)$": "ts-jest",
  }

};