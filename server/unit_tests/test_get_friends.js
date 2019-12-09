
const Logger = require('../utility/logger.js')

const chai   = require('chai').should
const expect = require('chai').expect;
const assert = require('chai').assert;


const ObjectID = require('mongodb').ObjectID;

    const user_a = {
        email:    'cobraman@nofriends.se',
        username: 'cobraman',
        password: 'testtest'
    };

    const users = [{
        email:    'friend1@gmail.se',
        username: 'friend1',
        password: 'testtest'
    },
    {
        email:    'friend2@gmail.se',
        username: 'friend2',
        password: 'testtest'
    },
    {
        email:    'friend3@gmail.se',
        username: 'friend3',
        password: 'testtest'
    },
    {
        email:    'friend4@gmail.se',
        username: 'friend4',
        password: 'testtest'
    }]

module.exports = async function ()  { 
    
    let userID;
    let createdIds = [];
    before(async () => {

        await this.apiFunctions.createAccount(user_a)
        const userAData = await this.userManager.getUserByUsername(user_a.username)
        userID = userAData.user_id.toString();

        for(const user of users) {
            const authData = await this.apiFunctions.createAccount(user)
            const userData = await this.userManager.getUserByUsername(user.username)
            createdIds.push(userData.user_id.toString())
        }

        for(const id of createdIds) {
            await this.apiFunctions.addFriendId(userID, id)
        }

    })

    it('It should get the added friend', async () => {
        const friends = await this.apiFunctions.friends(userID)
        const friendIds = friends.map(friend => friend.user_id.toString());
        assert.equal(friendIds.length, createdIds.length);
        assert.deepEqual(friendIds, createdIds);
    })    
}