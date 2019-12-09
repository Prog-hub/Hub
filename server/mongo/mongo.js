const MongoClient = require('mongodb').MongoClient;
const CollectionApi = require('./collection_api.js')
const Logger = require('../utility/logger.js');

// Mongo driver
class Mongo {
    constructor(url, dbName, hubCollectionName, authCollectionName, userCollectionName, chatCollectionName) {
        // Connection URL
        this.url = url;

        // Database Name
        this.dbName = dbName;
        this.hubCollectionName  = hubCollectionName;
        this.authCollectionName = authCollectionName;
        this.userCollectionName = userCollectionName;
        this.chatCollectionName = chatCollectionName;
        //private collections
        this.authCollectionApi  = null;
        this.userColllectionApi = null;
        this.hubCollectionApi   = null;
        this.chatCollectionApi = null;
        
        this.isConnected = false;

        // Create a new MongoClient
        this.client = new MongoClient(this.url, { useNewUrlParser: true, useUnifiedTopology: true });
        this._createDbWithAuthCollection = this._createDbWithAuthCollection.bind(this)
        this._createDbWithHubCollection  = this._createDbWithHubCollection.bind(this)
        this._createDbWithUserCollection = this._createDbWithUserCollection.bind(this)
        this._createDbWithChatCollection = this._createDbWithChatCollection.bind(this);
        this._connect = this._connect.bind(this);
        this.wipe     = this.wipe.bind(this);
    }

    
    // ======== Private functions ==========

    // =============HUB==============
    _createDbWithHubCollection(cb) {
        //this.client.db = new Db("testdatabas", new Server("localhost", 3000));
        this.db = this.client.db(this.dbName);
        this.db.createCollection(this.hubCollectionName, (err,collection) => { 
            const api = new CollectionApi(collection)
            this.hubCollectionApi = api;
            cb(api)
        })
    }


    // =============AUTH=============
    _createDbWithAuthCollection(cb) {
        this.db.createCollection(this.authCollectionName, (err,collection) => { 
            const api = new CollectionApi(collection);
            this.authCollectionApi = api;
            cb(api)
        })
    }

    // =============USER=============
    _createDbWithUserCollection(cb) {
        this.db.createCollection(this.userCollectionName, (err,collection) => { 
            const api = new CollectionApi(collection);
            this.userColllectionApi = api;
            cb(api)
        })
    }

    // =============Chat=============
    _createDbWithChatCollection(cb) {
        this.db.createCollection(this.chatCollectionName, (err,collection) => { 
            const api = new CollectionApi(collection);
            this.userColllectionApi = api;
            cb(api)
        })
    }

    _connect(cb) {
        if (this.isConnected) { return cb(null) }
        this.client.connect((err) => { 
            this.db = this.client.db(this.dbName);
            this.isConnected = true; 
            cb(err); 
        })
        Logger.debug("Connected successfully to server");
    }

    //======== Public functions ======

    async wipe() {
        return new Promise((cb, reject) => {
            this._connect((err) => {
                this.db.dropDatabase();
                console.log("DATA BASE WAS WIPED")
                cb();  
            })
        })
    }

    async initialize_hub(cb) {
        return new Promise((cb, reject) => {
            this._connect((err) =>  { // skapar buffer med api till filen
                if(err) {Logger.error("SOMETHING WENT WRONG WHILE CONNECTING", err)}
                this._createDbWithHubCollection((api) => { cb(api); })
                //client.close();
            });
        })
    }

    async initialize_auth(cb) {
        return new Promise((cb, reject) => {
            this._connect((err) =>  { // skapar buffer med api till filen
                if(err) {Logger.error("SOMETHING WENT WRONG WHILE CONNECTING")}
                this._createDbWithAuthCollection((api) => { cb(api); })
                //client.close();
            });
        })
    }

    async initialize_user(cb) {
        return new Promise((cb, reject) => {
            this._connect((err) =>  { // skapar buffer med api till filen
                if(err) {Logger.error("SOMETHING WENT WRONG WHILE CONNECTING")}
                this._createDbWithUserCollection((api) => { cb(api); })
                //client.close();
            });
        })
    }


    async initialize_chat(cb) {
        return new Promise((cb, reject) => {
            this._connect((err) =>  { // skapar buffer med api till filen
                if(err) {Logger.error("SOMETHING WENT WRONG WHILE CONNECTING")}
                this._createDbWithChatCollection((api) => { cb(api); })
                //client.close();
            });
        })
    }

    // ==================================
}

module.exports = Mongo;