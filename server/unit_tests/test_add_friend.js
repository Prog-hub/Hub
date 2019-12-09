const Logger = require('../utility/logger.js')

const chai   = require('chai').should
const expect = require('chai').expect;
const assert = require('chai').assert;


const ObjectID = require('mongodb').ObjectID;

    
module.exports = async function ()  { 
    const user_a = {
        email:    'lonely@nofriends.se',
        username: 'lonelywantsfriends',
        password: 'testtest'
    };

    const user_b = {
        email:    'popular@rich.se',
        username: 'richhasmanyfriends',
        password: 'testtest'
    };

    before(async () => { 
        await this.apiFunctions.createAccount(user_a)
        await this.apiFunctions.createAccount(user_b)
    })

    step('It should add a friend', async () => {
        const userAData  = await this.apiFunctions.credentials(user_a.username);
        const userBData  = await this.apiFunctions.credentials(user_b.username);
        const result     = await this.apiFunctions.addFriendId(userAData.user_id, userBData.user_id);
        assert.equal(result.code, 200)
    })

    step('Friends should have eachothers ids', async () => {
        const userAData  = await this.userManager.getUserByUsername(user_a.username);
        const userBData  = await this.userManager.getUserByUsername(user_b.username);
        assert.include(userAData.friend_ids.map(id => id.toString()), userBData.user_id.toString())
        assert.include(userBData.friend_ids.map(id => id.toString()), userAData.user_id.toString())
    })

    step('Fails to add eachothers again', async () => {
        const userAData  = await this.userManager.getUserByUsername(user_a.username);
        const userBData  = await this.userManager.getUserByUsername(user_b.username);
        const result     = await this.apiFunctions.addFriendId(userAData.user_id, userBData.user_id);
        assert.equal(result.code, 304);
        assert.equal(result.body.message, "Already friends")
    })


}