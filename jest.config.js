module.exports = {
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  moduleDirectories:['node_modules','src'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    'src/(.*)$': '<rootDir>/src/$1',
  }
};