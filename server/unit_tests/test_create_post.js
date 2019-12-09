const assert = require('chai').assert;
const ObjectID = require('mongodb').ObjectID;
    
module.exports = async function ()  {
    const creator_user = {
        email:    'killer5@testsson.se',
        username: 'KillerCreator',
        password: 'testtest'
    };

    const target_user = {
        email:    'victim5@testsson.se',
        username: 'victimPosted',
        password: 'testtest'
    };

    before(async () => {
        // ====== register accounts to use in the test
        const entry = await this.apiFunctions.createAccount(creator_user);
        const entry2 = await this.apiFunctions.createAccount(target_user);
    })

    let postInDb;
    let creatorUserData
    let targetUserData

    step('creates a post', async () =>  {
        creatorUserData = await this.apiFunctions.credentials(creator_user.username);
        targetUserData  = await this.apiFunctions.credentials(target_user.username);

        const postOps = await this.apiFunctions.createPost('Apan i buren', creatorUserData.user_id.toString(), targetUserData.user_id.toString());
        assert.isNotNull(postOps);

        postInDb = await this.hub_collection_api.getEntry({_id: ObjectID(postOps._id)})
        assert.deepEqual(postOps, postInDb)
    })

    step('users realtion to post after creating it', async () =>  {
        assert.isNotNull(postInDb);
        assert.equal(postInDb.target_user_id.toString(), targetUserData.user_id.toString())
        assert.equal(postInDb.user_id.toString(), creatorUserData.user_id.toString())
    })

    step('users have post id in their entry in usercollection', async () =>  {
        const updatedCreatorUserData = await this.userManager.getUserByUsername(creator_user.username);
        const updatedTargetUserData  = await this.userManager.getUserByUsername(target_user.username);

        assert.isNotNull(postInDb);
        assert.include(updatedTargetUserData.post_ids.map(id=>id.toString()), postInDb._id.toString())
        assert.include(updatedCreatorUserData.post_ids.map(id=>id.toString()), postInDb._id.toString())
    })


}