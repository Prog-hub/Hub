const ObjectID = require('mongodb').ObjectID;
const Logger = require('../utility/logger')

function response(code, message, data = null) { return { code, body: {message, data} } }
function postEntry(text, user_id, target_user_id) {
    return (
        {
            text,
            user_id: ObjectID(user_id),
            target_user_id: ObjectID(target_user_id),
            date: Date.now()
        }
    )
}


class HubManager {

    constructor(api) {
        this.api = api; //ett interface
    }

    // NEW
    async createPost(text, user_id, target_user_id) {
        try { 
            const data = await this.api.insertEntry(postEntry(text, user_id, target_user_id));
            const res = data.ops[0]
            return res;//response(200, `Tweeten skapades`, res)
        } 
        catch (err) { 
            Logger.error(err);
            return null;//response(500, 'Något gick fel fyfan!');
        }
    }
 
    //NEW
    async getPosts(post_ids) {
        const posts    = await this.api.getEntriesSorted({ _id: {$in: post_ids}}, {'date': -1});
        return posts;
    }


}


module.exports = { HubManager }  