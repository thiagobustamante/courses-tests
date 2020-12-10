module.exports = {
    preset: '@shelf/jest-mongodb',
    moduleFileExtensions: ['js', 'json', 'node'],
    rootDir: '../',
    testMatch: ['**/test/integration/**/*.spec.js'],
    coverageDirectory: 'reports/coverage',
    collectCoverageFrom: [
        'lib/**/*.{js,jsx}'
    ]
};
