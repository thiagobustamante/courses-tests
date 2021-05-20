const express = require('express');
const http = require('http');

const server = express();
const validOrders = new Set();


server.post('/orders/:orderId/checkout', (req, res, next) => {
    const orderId = req.params.orderId;
    
    if (validOrders.contains(orderId)) {
        res.send({
            customerId: '123456789',
            orderId: req.params.orderId,
            status: 'created'
        });
    } else {
        res.status(404).send('');
    }
});

module.exports = {
    start: (port, cb) => {
        http.createServer(server).listen(port, cb);
    }, 
    validOrders: validOrders
};
  