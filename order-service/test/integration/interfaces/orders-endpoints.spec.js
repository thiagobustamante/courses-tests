const {MongoClient} = require('mongodb');
const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const server = require('../../../lib/infrastructure/server/server');
const nock = require('nock');
const { env } = require('process');

const post = async (resource, body) => {
    const response = await fetch(`http://localhost:3000${resource}`, {
        method: 'post',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'}
    });
    return response;
};

let connection;
let db;
let ordersServer;
beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    db = await connection.db();

    const port = 3000;
    const apiSpec = path.join(__dirname, '../../../lib/open-api.yaml');
    ordersServer = await server.configure(express(), apiSpec, port)
});

afterAll(async () => {
    await connection.close();
    await ordersServer.close();
});


describe('Orders Endpoints', () => {
           
    beforeEach(async () => {
        await db.collection('orders').deleteMany({});
    });

    it('should create an order', async () => {
        const response = await post('/orders', { customerId: '1234' });
        const location = response.headers.get('Location');

        expect(location).toBeDefined();
        expect(location.length).toBeGreaterThan(8);

        const orderId = location.substring(8);

        const orders = db.collection('orders');      
        const order = await orders.findOne({ 'id': orderId });
        expect(order).toMatchObject({ customerId: '1234', id: orderId });
    });

    it('should create an order item', async () => {
        let response = await post('/orders', { customerId: '1234' });
        const location = response.headers.get('Location');

        expect(location).toBeDefined();
        expect(location.length).toBeGreaterThan(8);

        const orderId = location.substring(8);

        response = await post(`/orders/${orderId}/items`, { productId: '111', amount: 2 });
        const item = await response.json();
        const orders = db.collection('orders');      
        const order = await orders.findOne({ 'id': orderId });
        expect(item).toEqual({ productId: '111', amount: 2 });
        expect(order).toMatchObject({ customerId: '1234', id: orderId, items: [ item ] });
    });

});

describe('Order Service', () => {
   beforeEach(async () => {
        await db.collection('orders').deleteMany({});
    });
 
   it('should create a checkout for an order', async () => {
        let response = await post('/orders', { customerId: '1234' });
        const location = response.headers.get('Location');

        expect(location).toBeDefined();
        expect(location.length).toBeGreaterThan(8);

        const orderId = location.substring(8);

        const CHECKOUT_URL = 'http://myserviceurl:3001'
        const checkout = {
            customerId: '1234',
            orderId: orderId,
            status: 'created'
        };
        process.env.CHECKOUT_URL = CHECKOUT_URL;
        nock(CHECKOUT_URL)
            .post(`/orders/${orderId}/checkout`)
            .reply(200, JSON.stringify(checkout));

        response = await post(`/orders/${orderId}/checkout`);
        const receivedCheckout = await response.json();
        expect(receivedCheckout).toEqual(checkout);
    });
});
