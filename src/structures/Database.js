const { MongoClient } = require('mongodb');
const logger = new (require('../utils/Logger'));

module.exports = class extends MongoClient {
    constructor() {
        super(
            process.env.DATABASEURL
        );
        this.client = new MongoClient(process.env.DATABASEURL, {useNewUrlParser: true, useUnifiedTopology: true});
    }

    async connect() {
        await logger.send('Database', 'Attempting to connect to cluster...');
        await this.client.connect();
        await logger.send('Database', 'Successfully connected to cluster')
    }

    async close() {
        await logger.warn('Database', 'Connection closed');
        await this.client.close();
    }

    getCollection(collectionName) {
        try {
            return this.client.db('Main').collection(collectionName);
        } catch(error) {
            void logger.error('Database', 'An error occurred when executing the getCollection action\n' + error);
        }
    }

    insert(collectionName, data) {
        try {
            return this.client.db('Main').collection(collectionName).insertMany(data);
        } catch(error) {
            void logger.error('Database', 'An error occurred when executing the insert action\n' + error);
        }
    }

    serverStatus() {
        try {
            return this.client.db('Main').runCommand({ serverStatus: 1});
        } catch(error) {
            void logger.error('Database', 'An error occurred when executing the serverStatus action\n' + error);
        }
    }

    findOne(collectionName, findParameters, createIfNotExist) {
        try {
            const res = this.client.db('Main').collection(collectionName).findOne(findParameters);
            if(res === null && createIfNotExist === true) {
                this.insert(collectionName, findParameters);
                return this.findOne(collectionName, findParameters);
            } else {
                return res;
            }
        } catch(error) {
            void logger.error('Database', 'An error occurred when executing the findOne action\n' + error);
        }
    }

    findAll(collectionName, findParameters) {
        try {
            return this.client.db('Main').collection(collectionName).find(findParameters);
        } catch(error) {
            void logger.error('Database', 'An error occurred when executing the findOne action\n' + error);
        }
    }

    estimatedDocumentCount(collectionName) {
        try {
            return this.client.db('Main').collection(collectionName).estimatedDocumentCount();
        } catch(error) {
            void logger.error('Database', 'An error occurred when executing the estimatedDocumentCount action\n' + error);
        }
    }

    deleteMany(collectionName, findParameters) {
        try {
            return this.client.db('Main').collection(collectionName).deleteMany(findParameters);
        } catch(error) {
            void logger.error('Database', 'An error occurred when executing the deleteMany action\n' + error);
        }
    }

    setOne(collectionName, findParameters, data) {
        try {
            return this.client.db('Main').collection(collectionName).updateOne(findParameters, { $set: data });
        } catch(error) {
            void logger.error('Database', 'An error occurred when executing the setOne action\n' + error);
        }
    }

    pushOne(collectionName, findParameters, data) {
        try {
            return this.client.db('Main').collection(collectionName).updateOne(findParameters, { $push: data });
        } catch(error) {
            void logger.error('Database', 'An error occurred when executing the pushOne action\n' + error);
        }
    }
}
