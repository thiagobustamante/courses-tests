const { BeforeAll, AfterAll } = require('@cucumber/cucumber');
const { GenericContainer } = require("testcontainers");
const { EnqueuerStepDefinitions } = require('enqueuer-cucumber');
const { Configuration } = require('enqueuer');
const express = require('express');
const path = require('path');
const server = require('../../../../lib/infrastructure/server/server');
const enqueuerFiles = path.join(__dirname, '../enqueuer/**/*.yaml');

Configuration.getInstance().addFiles(enqueuerFiles);
new EnqueuerStepDefinitions().build();

let ordersServer;
let container;

BeforeAll(async () => {
    container = await new GenericContainer('mongo')
    .withExposedPorts(27017)
    .start();

    process.env.MONGO_URL = `mongodb://${container.getHost()}:${container.getMappedPort(27017)}/orders`;

    const port = 3000;
    const apiSpec = path.join(__dirname, '../../../../lib/open-api.yaml');
    ordersServer = await server.configure(express(), apiSpec, port);
});
    
AfterAll(async () => {
    await ordersServer.close();
    await container.stop();
});