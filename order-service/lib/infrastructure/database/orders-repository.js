const MongoDB = require('./mongo');

class OrdersRepository {
    async _orders() {
        if (!this.ordersCollection) {
            const mongoClient = await MongoDB.getMongoClient();
            this.ordersCollection = mongoClient.db().collection('orders');
        }
        return this.ordersCollection;
    }

    async persist(order) {
        const ordersCollection = await this._orders();
        return ordersCollection.updateOne({ id: order.id }, { $set: order }, { upsert: true });
    }

    async load(orderId) {
        const ordersCollection = await this._orders();
        return ordersCollection.findOne({ 'id': orderId });
    }
}

module.exports = {
    OrdersRepository
};