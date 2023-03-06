let MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017/fileapp';

exports.connect = (callback) => {
    MongoClient.connect(url, function(err,client){
        return callback(err, client);
    });
};