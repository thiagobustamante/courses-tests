const express = require('express');
const path = require('path');
const server = require('./infrastructure/server/server');


const port = 3000;
const apiSpec = path.join(__dirname, 'open-api.yaml');
const app = express();

server.configure(app, apiSpec, port)
  .then(() => {
    console.log(`Listening on port ${port}`);
  }).catch((error) => {
    console.error(`Error starting server.`);
    console.error(error);
  });

module.exports = app;