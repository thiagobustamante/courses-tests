module.exports = (config) => {
  config.set({
    packageManager: 'npm',
    reporters: [ 'html', 'clear-text', 'progress' ],
    testRunner: 'jest',
    jest: {
      projectType: 'custom',
      config: require('./jest.config-unit.js'),
      enableFindRelatedTests: true,
    },
    coverageAnalysis: 'off',
    mutate: ['lib/**/*.js'],
    thresholds: { 
      break: 99 
    }
  });
};