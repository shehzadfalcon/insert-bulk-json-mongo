const fs = require('fs');
const client = require('./db').getClient()
const redisClient = require('./redisClient').getRedisClient();
const StreamArray = require('stream-json/streamers/StreamArray');
const jsonStream = StreamArray.withParser();

async function insertMillionRecords(COLLECTION_NAME = 'one-million', PATH_MIL = './datasets/1m-generated.json') {
    try {
        console.time('Reading json')
        // const records = JSON.parse(await fs.readFile(PATH_1MIL));
        fs.createReadStream(PATH_MIL).pipe(jsonStream.input);
        let result = []

        let records = await new Promise((resolve, reject) => {
            jsonStream.on('data', ({ value }) => {
                result.push(value)
            })
            jsonStream.on('end', function () {
                resolve(result)
            })
        })
        console.timeEnd('Reading json')
        // redisClient.del(COLLECTION_NAME)
        const cacheResults = await redisClient.get(COLLECTION_NAME);
        if (cacheResults == null) {
            const oneMillion = client.collection(COLLECTION_NAME);
            console.time('Inserting records')
            await oneMillion.insertMany(records);
            console.timeEnd('Inserting records')
            await redisClient.set(COLLECTION_NAME, JSON.stringify(records), {
                // EX: 86400000, one day expiration
                NX: true
            });
            console.log('records inserted successfully!')
        }

    } catch (e) {
        console.error("error", e);
    }
    return
}
insertMillionRecords()

