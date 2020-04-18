const { OrderUseCases } = require('../application/orders');


module.exports = {
    createOrder: async (call, res, next) => {
        try {
            const orderUseCases = new OrderUseCases();
            const order = await orderUseCases.createOrder(call.body);
            res.writeHead(201, { 'Location': `/orders/${order.id}` });
            res.end();
        } catch (error) {
            next(error);
        }
    },

    createOrderItem: async (call, res, next) => {
        try {
            const orderId = call.params.orderId;
            const item = call.body;

            const orderUseCases = new OrderUseCases();
            await orderUseCases.addOrderItem(orderId, item);

            res.status(200).send(item);
        } catch (error) {
            next(error);
        }
    }
};
