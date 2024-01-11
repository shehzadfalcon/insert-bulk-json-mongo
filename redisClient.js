const redis = require('redis');
let redisClient;

module.exports={
    connectToServer:async function run() {
        redisClient = redis.createClient({
            url: 'redis://redis:6379'
          });
      
        redisClient.on("error", (error) => {
            redisClient=null
            console.error(`Error : ${error}`)});
      
        await redisClient.connect();
      },
    getRedisClient: function() {
        return redisClient;
      }
 }
