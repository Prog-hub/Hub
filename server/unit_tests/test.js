const HubManager   = require('../managers/hub_manager').HubManager
const AuthManager  = require('../managers/auth_manager').AuthManager
const UserManager  = require('../managers/user_manager').UserManager
const ChatManager  = require('../managers/chat_manager').ChatManager
//const ObjectID = require('mongodb').ObjectID;
const ApiFunctions = require('../api_functions');

const ObjectID = require('mongodb').ObjectID;

//const config = require('./config.js')
const appconfig = require('../appconfig');
const config = appconfig['test']['db'];

const Mongo  = require('../mongo/mongo.js')
const Logger = require('../utility/logger.js')

const chai   = require('chai').should
const expect = require('chai').expect;
const assert = require('chai').assert;

const login_test          = require('./test_login.js')
const register_test       = require('./test_register.js')
const getCredentials_test = require('./test_get_credentials.js')
const create_post_test    = require('./test_create_post.js')
const add_friend_test     = require('./test_add_friend')
const get_friends_test    = require('./test_get_friends') 

const process  = require('process');

process.env.NODE_ENV = 'test';
 

async function init() {
        this.database_api        = new Mongo(config.url, config.db_name, config.hub_collection_name, config.auth_collection_name, config.user_collection_name, config.chat_collection_name);
        this.hub_collection_api  = await this.database_api.initialize_hub();  // mongo_hub_api
        this.auth_collection_api = await this.database_api.initialize_auth(); // mongo_auth_api 
        this.user_collection_api = await this.database_api.initialize_user();
        this.chat_collection_api = await this.database_api.initialize_chat();

        this.hubManager          = new HubManager(this.hub_collection_api);
        this.authManager         = new AuthManager(this.auth_collection_api);
        this.userManager         = new UserManager(this.user_collection_api);
        this.chatManager         = new ChatManager(this.chat_collection_api);
        this.apiFunctions        = new ApiFunctions(this.authManager, this.hubManager, this.userManager, this.chatManager);
}

function finish(done) {
    this.database_api.db.dropDatabase()
    this.database_api.client.close()
    done()
}

// arrow functions auto bindar
describe("#User data flow tests", function () {
    before(init.bind(this))
    describe('Running LOGIN tests',           login_test.bind(this))
    describe('Running REGISTER tests',        register_test.bind(this))
    describe('Running getCredentials tests',  getCredentials_test.bind(this))
    describe('Running createPost tests',      create_post_test.bind(this))
    describe('Running Add friends tests',     add_friend_test.bind(this))
    describe('Running Get friends tests',     get_friends_test.bind(this))
    after(finish.bind(this));
})

// LÄGG till descibes här om du vill skapa helt annorlunda flöden