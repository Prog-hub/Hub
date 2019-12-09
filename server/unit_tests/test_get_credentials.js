const Logger = require('../utility/logger.js')

const chai   = require('chai').should
const expect = require('chai').expect;
const assert = require('chai').assert;

const ObjectID = require('mongodb').ObjectID;

    
module.exports = async function ()  { 
    const input_data = {
        email:    'credentialskillen@testsson.se',
        username: 'credentialsGubben',
        password: 'testtest'
    };

    let user_id;

    before(async () => {
        const entry = await this.authManager.createAccount(input_data.email, input_data.username, input_data.password);
        assert.equal(entry.code, 200);
        user_id = entry.body.data._id;
        await this.userManager.createUser(user_id, input_data.email, input_data.username); 
    })


    it('should get the credentials of a user', async () => {
       const res = await this.authManager.getCredentials(user_id);
       const fetched_username = res.body.data.username
       const fetched_email    = res.body.data.email
       assert.equal(res.code, 200)
       assert.equal(res.body.message,'Credentials found')
       assert.equal(fetched_email,    input_data.email)
       assert.equal(fetched_username, input_data.username)
    })


    it('should fail to get the credentials of a user with random id', async () => {
       const res = await this.authManager.getCredentials("2134");
       assert.equal(res.code, 403)
       assert.equal(res.body.message,'Credentials not found')
       assert.isNull(res.body.data)
    })

}