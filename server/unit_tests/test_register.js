const Logger = require('../utility/logger.js')

const chai   = require('chai').should
const expect = require('chai').expect;
const assert = require('chai').assert;

const ObjectID = require('mongodb').ObjectID;

    
module.exports = async function ()  {

    describe("#Register a user", () => {
        it('registers a user in the auth collection', async () => {

            const input_data = {
                email:    'test3@testsson.se',
                username: 'Tert500',
                password: 'testtest'
            };

            const entry = await this.authManager.createAccount(input_data.email, input_data.username, input_data.password);
            assert.equal(entry.code, 200);
            assert.exists(entry.body);
            assert.exists(entry.body.data);
            assert.exists(entry.body.data._id);
            const user_id = entry.body.data._id;
            await this.userManager.createUser(user_id, input_data.email, input_data.username); 
            const data_from_db = await this.auth_collection_api.getEntry({_id: user_id});
            assert.exists(data_from_db);
            return;
        })

        it('fails to register if a user already exists', async () => {
            const input_data = {
                email:    'double@testsson.se',
                username: 'Testsson2',
                password: 'testtest'
            };
            
            const first_entry  = await this.authManager.createAccount(input_data.email, input_data.username, input_data.password);
            assert.equal(first_entry.code, 200);
            await this.userManager.createUser(first_entry.body.data._id, input_data.email, input_data.username); 

            const double_entry = await this.authManager.createAccount(input_data.email, input_data.username, input_data.password);
            assert.equal(double_entry.code, 409);
            assert.isNull(double_entry.body.data);
            assert.equal(double_entry.body.message, 'Email already exists');
        });

        it('fails to register if email is wrong', async () => {
            const input_data = {
                email:    'failure.se',
                username: 'Testsson3',
                password: 'testtest'
            };
            
            const entry  = await this.authManager.createAccount(input_data.email, input_data.username, input_data.password);
            assert.equal(entry.code, 400);
            assert.isNull(entry.body.data);
            assert.equal(entry.body.message, 'Not a valid email');
        });


        it('fails to register if email is wrong 2', async () => {
            const input_data = {
                email:    'fail@failure',
                username: 'Testsson4',
                password: 'testtest'
            };
            
            const entry  = await this.authManager.createAccount(input_data.email, input_data.username, input_data.password);
            assert.equal(entry.code, 400);
            assert.isNull(entry.body.data);
            assert.equal(entry.body.message, 'Not a valid email');
        });


        it('fails to register if password is shorter than 6', async () => {
            const input_data = {
                email:    'failure@testsson.se',
                username: 'Testsson5',
                password: '12345'
            };
            
            const entry  = await this.authManager.createAccount(input_data.email, input_data.username, input_data.password);
            assert.equal(entry.code, 400);
            assert.isNull(entry.body.data);
            assert.equal(entry.body.message, 'Not a valid password');
        });


        it('fails to register if password is longer than 16', async () => {
            const input_data = {
                email:    'failure@testsson.se',
                username: 'Testsson6',
                password: '123456789abcdefgh'
            };
            
            const entry  = await this.authManager.createAccount(input_data.email, input_data.username, input_data.password);
            assert.equal(entry.code, 400);
            assert.isNull(entry.body.data);
            assert.equal(entry.body.message, 'Not a valid password');
        });
    })


    describe("#Create User in user manager after register", () => { // TODO: kanske lägga vissa saker i funktioner
        
        let created_user_id;
        let created_email;
        let created_username;

        step("should create a user in user collection", async () => {
            const input_data = {
                email:    'success@succ.se',
                username: 'Testsson7',
                password: 'testtest'
            };
            
            const entry  = await this.authManager.createAccount(input_data.email, input_data.username, input_data.password);
            
            assert.equal(entry.code, 200);
            
            const user_id  = entry.body.data._id;
            const email    = input_data.email;
            const username = input_data.username;
            const ops_data = await this.userManager.createUser(user_id, email, username); 
            assert.equal(ops_data.user_id, user_id);
            assert.equal(ops_data.email, email);
            assert.equal(ops_data.username, username);
            
            created_user_id  = user_id;
            created_email    = email;
            created_username = username;
        })


        step("should exist in the collection", async () => {
            // THE TESTS
            const user_entry = await this.user_collection_api.getEntry({user_id: ObjectID(created_user_id)})
            assert.equal(user_entry.user_id.toString(), created_user_id)
            assert.equal(user_entry.email, created_email)
            assert.equal(user_entry.username, created_username)
            assert.isArray(user_entry.post_ids)
            assert.isEmpty(user_entry.post_ids)
            assert.isArray(user_entry.friend_ids)
            assert.isEmpty(user_entry.friend_ids)
        })
    })

}