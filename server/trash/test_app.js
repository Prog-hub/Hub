const HubManager  = require('../managers/hub_manager').HubManager
const AuthManager = require('../managers/auth_manager').AuthManager
const UserManager = require('../managers/user_manager').UserManager
//const ObjectID = require('mongodb').ObjectID;

const config = require('./config.js')

const Mongo  = require('../mongo/mongo.js')
const Logger = require('../utility/logger.js')

const chai = require('chai').should
var expect = require('chai').expect;
var assert = require('chai').assert;

const ObjectID = require('mongodb').ObjectID;
const process = require('process');
process.env.NODE_ENV = 'test';
 

describe("#Managers", () => {
    var database_api;
    //var hub_collection_api;
    var auth_collection_api;
    var user_collection_api;
    //var hubManager;
    var authManager;
    var userManager;

    before(async () => { 
        database_api        = new Mongo(config.url, config.db_name, config.post_collection_name, config.auth_collection_name, config.user_collection_name);
        //hub_collection_api  = await database_api.initialize_hub();  // mongo_hub_api
        auth_collection_api = await database_api.initialize_auth(); // mongo_auth_api 
        user_collection_api = await database_api.initialize_user();
        //hubManager          = new HubManager(hub_collection_api);
        authManager         = new AuthManager(auth_collection_api);
        userManager         = new UserManager(user_collection_api);
        return
    })


    describe("# AUTH MANAGER", () => {
        it('registers a user in the auth collection', async () => {

            const input_data = {
                email:    'test3@testsson.se',
                username: 'Testsson',
                password: 'testtest'
            };

            const entry = await authManager.createAccount(input_data.email, input_data.username, input_data.password);
            assert.equal(entry.code, 200);
            assert.exists(entry.body);
            assert.exists(entry.body.data);
            assert.exists(entry.body.data._id);
            const user_id = entry.body.data._id;
            await userManager.createUser(user_id, input_data.email, input_data.username); 
            const data_from_db = await auth_collection_api.getEntry({_id: user_id});
            assert.exists(data_from_db);
            return;
        })

        it('Fails to register if a user already exists', async () => {
            const input_data = {
                email:    'double@testsson.se',
                username: 'Testsson',
                password: 'testtest'
            };
            
            const first_entry  = await authManager.createAccount(input_data.email, input_data.username, input_data.password);
            assert.equal(first_entry.code, 200);
            await userManager.createUser(first_entry.body.data._id, input_data.email, input_data.username); 

            const double_entry = await authManager.createAccount(input_data.email, input_data.username, input_data.password);
            assert.equal(double_entry.code, 409);
            assert.isNull(double_entry.body.data);
            assert.equal(double_entry.body.message, 'Email already exists');
        });

        it('Fails to register if email is wrong', async () => {
            const input_data = {
                email:    'failure.se',
                username: 'Testsson',
                password: 'testtest'
            };
            
            const entry  = await authManager.createAccount(input_data.email, input_data.username, input_data.password);
            assert.equal(entry.code, 400);
            assert.isNull(entry.body.data);
            assert.equal(entry.body.message, 'Not a valid email');
        });


        it('Fails to register if email is wrong 2', async () => {
            const input_data = {
                email:    'fail@failure',
                username: 'Testsson',
                password: 'testtest'
            };
            
            const entry  = await authManager.createAccount(input_data.email, input_data.username, input_data.password);
            assert.equal(entry.code, 400);
            assert.isNull(entry.body.data);
            assert.equal(entry.body.message, 'Not a valid email');
        });


        it('Fails to register if password is shorter than 6', async () => {
            const input_data = {
                email:    'failure@testsson.se',
                username: 'Testsson',
                password: '12345'
            };
            
            const entry  = await authManager.createAccount(input_data.email, input_data.username, input_data.password);
            assert.equal(entry.code, 400);
            assert.isNull(entry.body.data);
            assert.equal(entry.body.message, 'Not a valid password');
        });


        it('Fails to register if password is lomger than 16', async () => {
            const input_data = {
                email:    'failure@testsson.se',
                username: 'Testsson',
                password: '123456789abcdefgh'
            };
            
            const entry  = await authManager.createAccount(input_data.email, input_data.username, input_data.password);
            assert.equal(entry.code, 400);
            assert.isNull(entry.body.data);
            assert.equal(entry.body.message, 'Not a valid password');
        });
    })


    describe("# Create User in user manager", () => { // TODO: kanske lägga vissa saker i funktioner

        step("Shoud create a user in user collection", async () => {
            const input_data = {
                email:    'success@succ.se',
                username: 'Testsson',
                password: 'testtest'
            };
            
            const entry  = await authManager.createAccount(input_data.email, input_data.username, input_data.password);
            
            assert.equal(entry.code, 200);
            
            const user_id  = entry.body.data._id;
            const email    = input_data.email;
            const username = input_data.username;
            const ops_data = await userManager.createUser(user_id, email, username); 
            assert.equal(ops_data.user_id, user_id);
            assert.equal(ops_data.email, email);
            assert.equal(ops_data.username, username);
            
            created_user_id  = user_id;
            created_email    = email;
            created_username = username;
        })


        step("Should exist in the collection", async () => {
            // THE TESTS
            const user_entry = await user_collection_api.getEntry({user_id: ObjectID(created_user_id)})
            assert.equal(user_entry.user_id.toString(), created_user_id)
            assert.equal(user_entry.email, created_email)
            assert.equal(user_entry.username, created_username)
            assert.isArray(user_entry.post_ids)
            assert.isEmpty(user_entry.post_ids)
            assert.isArray(user_entry.friend_ids)
            assert.isEmpty(user_entry.friend_ids)
        })
    })



    after((done) => {
        database_api.db.dropDatabase()
        database_api.client.close()
        done()
    });

})