const { BeforeAll, AfterAll } = require('@cucumber/cucumber');
// const { DockerComposeEnvironment } = require("testcontainers");
const { EnqueuerStepDefinitions } = require('enqueuer-cucumber');
const { Configuration } = require('enqueuer');
const path = require('path');
const enqueuerFiles = path.join(__dirname, '../enqueuer/**/*.yaml');

Configuration.getInstance().addFiles(enqueuerFiles);
new EnqueuerStepDefinitions().build();

let environment;

// BeforeAll(async () => {

//     const composeFilePath = path.resolve(__dirname, '../../');
//     const composeFile = 'docker-compose.yml';

//     environment = await new DockerComposeEnvironment(composeFilePath, composeFile).up();
// });
    
// AfterAll(async () => {
//     await environment.down();
// });