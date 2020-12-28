jest.mock('../../../../lib/infrastructure/database/mongo');

const MongoDB = require('../../../../lib/infrastructure/database/mongo');
const { OrdersRepository } = require('../../../../lib/infrastructure/database/orders-repository');
const ordersCollection = {
    updateOne: jest.fn(),
    findOne: jest.fn()
};
const collection = jest.fn();
const mongoClient = {
    db: jest.fn().mockImplementation(() => {
        return {
            collection: collection
        };
    })
};
let ordersRepository;

describe('OrdersRepository', () => {
        
    beforeEach(() => {
        ordersRepository = new OrdersRepository();
        MongoDB.getMongoClient.mockClear();
        MongoDB.getMongoClient.mockResolvedValue(mongoClient);
        ordersCollection.updateOne.mockClear();
        ordersCollection.findOne.mockClear();
        collection.mockClear();
        collection.mockReturnValue(ordersCollection);
    });
    
    it('should persist an order correctly', async () => {
        const order = { id: '123' };
        const expectedResult = true;
        ordersCollection.updateOne.mockResolvedValue(expectedResult);

        const result = await ordersRepository.persist(order);

        expect(MongoDB.getMongoClient).toBeCalledTimes(1);
        expect(collection).toBeCalledTimes(1);
        expect(collection).toBeCalledWith('orders');
        expect(ordersCollection.updateOne).toBeCalledTimes(1);
        expect(ordersCollection.updateOne).toBeCalledWith({ id: order.id }, { $set: order }, { upsert: true });
        expect(result).toEqual(expectedResult);
    });

    it('should load an order correctly', async () => {
        const orderId = '123';
        const expectedResult = { id: '123' };
        ordersCollection.findOne.mockResolvedValue(expectedResult);

        const result = await ordersRepository.load(orderId);

        expect(MongoDB.getMongoClient).toBeCalledTimes(1);
        expect(collection).toBeCalledTimes(1);
        expect(collection).toBeCalledWith('orders');
        expect(ordersCollection.findOne).toBeCalledTimes(1);
        expect(ordersCollection.findOne).toBeCalledWith({ 'id': orderId });
        expect(result).toEqual(expectedResult);
    });

    it('should cache ordersCollection', async () => {
        const orderId = '123';
        await ordersRepository.load(orderId);
        await ordersRepository.load(orderId);

        expect(MongoDB.getMongoClient).toBeCalledTimes(1);
        expect(collection).toBeCalledTimes(1);
        expect(collection).toBeCalledWith('orders');
        expect(ordersCollection.findOne).toBeCalledTimes(2);
    });
});