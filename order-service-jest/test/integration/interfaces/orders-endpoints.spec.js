const {MongoClient} = require('mongodb');
const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const server = require('../../../lib/infrastructure/server/server');

const post = async (resource, body) => {
    const response = await fetch(`http://localhost:3000${resource}`, {
        method: 'post',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'}
    });
    return response;
};

describe('Orders Endpoints', () => {
        
    let connection;
    let db;
   
    const app = express();
    
    beforeAll(async () => {
        connection = await MongoClient.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        db = await connection.db();

        const port = 3000;
        const apiSpec = path.join(__dirname, '../../../lib/open-api.yaml');
        await server.configure(app, apiSpec, port)
    });
   
    beforeEach(async () => {
        await db.collection('orders').deleteMany({});
    });

    afterAll(async () => {
        await connection.close();
        await app.close();
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
