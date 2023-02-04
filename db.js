let { MongoClient } = require('mongodb');
let dbConnection;
module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect('mongodb://localhost:27017/braines')
            .then((client) => {
                dbConnection = client.db();
                return cb()
            })
            .catch(err => {
                console.log(err);
                return cb(err);
            })
    },
    getDb: () => dbConnection
}