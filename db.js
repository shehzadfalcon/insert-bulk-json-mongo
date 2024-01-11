const {MongoClient}=require('mongodb');
const DB_NAME = 'performance1m';

const uri = "mongodb://mongo:27017";
const client = new MongoClient(uri);

let db;
 module.exports={
    connectToServer:async function run(){
        try {
            db=client.db(DB_NAME);
         console.log('Connected successfully to server');
        } catch (error) {
            console.error(error,"Mongo connect error")
        } 
    },
    getClient: function() {
        return db;
      }
 }