
const Logger = require("../utility/logger.js");


class CollectionAPI {
    constructor(collection) {
        this.collection = collection
    }

    async insertEntry (entry) {
        return new Promise((resolve, reject) => {
            this.collection.insertOne(entry, null, (err, data) => {
                if (err) { return reject(err) }
                resolve(data)
                Logger.debug("1 new entry inserted");                
            })
        })
    }
    
     async getEntry(query){
        return new Promise((resolve, reject) => {
            this.collection.findOne(query, (err, result) => {
                if (err) { return reject(err); }
                resolve(result) // result behöver konverteras
            });
        })
    }
    
    //NEW
    async getEntries(query){
        return new Promise((resolve, reject) => {
            this.collection.find(query, (err, result) => {
                if (err) { return reject(err); }
                resolve(result.toArray()) // result behöver konverteras
            });
        })
    }

    async getEntriesSorted(query, sortQuery){
        const data  = await this.collection.find(query).sort(sortQuery).toArray();
        return data;
    }

    //DEP WORKAROUND
    async updateEntryX(query, key, data) {
        return new Promise((resolve, reject) => {
            this.collection.findOne(query, (err, res) => {
                if (err) { return reject(err); }
                res[key].push(data);
                res.save(() => resolve());
            });        
        })
    }

    //NEW
    async updateEntry(query, newquery) {
        return new Promise((resolve, reject) => {
            this.collection.updateOne(query, newquery, (err, res) => {
                if (err) { return reject(err); }
                resolve(res.modifiedCount == 0 ? false : true) // TODO: säg till om det inte gick
                Logger.debug(`Document updated, proof: modification count is ${res.modifiedCount}`);
            });        
        })
    }
        
   async getAll() {
        return new Promise((resolve, reject) => {
            this.collection.find({}, null, (err, res) => {
                const all = res.toArray()
                if (err) { return reject(err) }
                resolve(all)
                Logger.debug("Got all documents");
            })
        })
    }

    index(query) {
        this.collection.createIndex(query);
    }

    async dropEntries() {

    }
    
}

module.exports = CollectionAPI
