module.exports = {
    testEnvironment: 'node',
    moduleFileExtensions: ['js', 'json', 'node'],
    rootDir: '../',
    testMatch: ['**/test/unit/**/*.spec.js', '**/test/integration/**/*.spec.js'],
    coverageDirectory: 'reports/coverage',
    collectCoverageFrom: [
        'lib/**/*.{js,jsx}'
    ],
    coverageThreshold: {
        global: {
            branches: 95,
            functions: 95,
            lines: 95,
            statements: 95
        }
    }
};
