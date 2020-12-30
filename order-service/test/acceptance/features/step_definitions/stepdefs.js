const { BeforeAll, AfterAll, Given, When, Then } = require('@cucumber/cucumber');
const { GenericContainer } = require("testcontainers");
const express = require('express');
const path = require('path');
const server = require('../../../../lib/infrastructure/server/server');
const nock = require('nock');
const request = require('supertest');
const assert = require('assert').strict;

let ordersServer;
let container;
const app = express();

BeforeAll(async function () {
    container = await new GenericContainer('mongo')
    .withExposedPorts(27017)
    .start();

    process.env.MONGO_URL = `mongodb://${container.getHost()}:${container.getMappedPort(27017)}/orders`;

    const port = 3000;
    const apiSpec = path.join(__dirname, '../../../../lib/open-api.yaml');
    ordersServer = await server.configure(app, apiSpec, port);
});
    
AfterAll(async function () {
    await ordersServer.close();
    await container.stop();
});

Given('I have an order to buy on my store', async function () {
    return request(app)
        .post('/orders')
        .set('Content-Type', 'application/json')
        .send({ customerId: 'myCustomerId' })
        .expect(201)
        .expect(response => !!response.headers['location'])
        .then(response => {
            this.orderId = response.headers['location'].substring(8);
        });
});

When('I start the checkout process', async function() {
    const CHECKOUT_URL = 'http://myserviceurl:3001'
    const checkout = {
        customerId: 'myCustomerId',
        orderId: this.orderId,
        status: 'created'
    };
    process.env.CHECKOUT_URL = CHECKOUT_URL;
    scope = nock(CHECKOUT_URL)
        .post(`/orders/${this.orderId}/checkout`, body => {
            this.checkoutCalled = true;
            return true;
        })
        .reply(200, JSON.stringify(checkout));

    return request(app)
        .post(`/orders/${this.orderId}/checkout`)
        .send()
        .expect(200, { 
            'customerId': 'myCustomerId',            
            'orderId': this.orderId,
            'status': 'created'
        });
});

Then('I should call the checkout service', function() {
    assert.equal(this.checkoutCalled, true);
});