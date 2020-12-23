const { Order } = require('../domain/orders');

class OrderUseCases {
    async createOrder(orderData) {
        const order = new Order();
        order.customerId = orderData.customerId;
        if (orderData.items) {
            orderData.items.forEach(item => order.addItem(item));
        }
        await order.save();
        return order;
    }

    async addOrderItem(orderId, item) {
        const order = new Order(orderId);
        await order.load();
        order.addItem(item);
        await order.save();
        return order;
    }

    async checkout(orderId) {
        const order = new Order(orderId);
        await order.load();
        return await order.createCheckout();
    }
}

module.exports = {
    OrderUseCases
};