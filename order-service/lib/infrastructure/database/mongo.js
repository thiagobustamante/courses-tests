const { MongoClient } = require('mongodb');

class MongoDB {
    static async getMongoClient() {
        if (!MongoDB.mongoClient) {
            const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/orders';
            MongoDB.mongoClient = await MongoClient.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
        }
        return MongoDB.mongoClient;
    }
}

module.exports = MongoDB;