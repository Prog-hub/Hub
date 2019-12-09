const ObjectID = require('mongodb').ObjectID;
const Mongo = require('../mongo/mongo')
const Logger = require('../utility/logger')
const {response} = require('../filter_models') 


function userEntry(user_id, email, username) {
    return ({
        user_id: ObjectID(user_id),
        email,
        username,
        friend_ids: [],
        post_ids: []
    })
}

    ObjectID.prototype.valueOf = function () {
	    return this.toString();
    };
// identifiers, friendids, postids, etc....
class UserManager {

    constructor(api) {
        this.api = api; //ett interface
        this.api.index({username: "text"})
        this.joinWithPosts = this.joinWithPosts.bind(this)
        this.search = this.search.bind(this);
    }

    async createUser(user_id, email, username) {
        const existingEntry = await this.api.getEntry({user_id: ObjectID(user_id)})
        if(existingEntry) { return null; }
        const data = await this.api.insertEntry(userEntry(user_id, email, username));
        const res = data.ops[0];
        return res;
    }

    async are_friends(uId, tId) {
        const user = await this.getCredentialsByUserId(uId);
        const friend_ids = user.friend_ids.map((id)=>id.toString());
        return friend_ids.includes(tId.toString());
    }

    async insertPost(post_id, owner_id, target_id) {
        try {
            await this.api.updateEntry({"user_id": ObjectID(owner_id)  }, { $push: {"post_ids": post_id} });
            await this.api.updateEntry({"user_id": ObjectID(target_id) }, { $push: {"post_ids": post_id} });
            return post_id;
        } catch(err) {
            Logger.error(err);
            return null;
        }
    }

    async addFriend(userid, friendid) {
        try { 

            this.api.updateEntry({"user_id": ObjectID(userid)},   { $push: { "friend_ids": ObjectID(friendid) }});
            this.api.updateEntry({"user_id": ObjectID(friendid)}, { $push: { "friend_ids": ObjectID(userid)   }});

            return response(200, 'Friend was added', []);
        } 
        catch (err) { 
            Logger.error(err);
            return response(500, 'Något gick fel fyfan!');
        }
    }
    
    async getFriends(userid) {
        try { 
            const userdata = await this.api.getEntry({user_id: ObjectID(userid)}) 
            const friendIds = userdata.friend_ids.map(id => ObjectID(id));
            const friends = await this.api.getEntries({ user_id: {$in: friendIds}});
            return friends;
        } 
        catch (err) { 
            Logger.error(err);
            return [];
        }
    }


    // keyword är username
    async search(keyword, userid) {
        try { 
            console.log(keyword); 
            //TODO gör en index för username db.articles.createIndex( { subject: "text" } )
            
            const data = await this.api.getEntries({username:{'$regex' : keyword, '$options' : 'i'}});
            //    {username:{$regex: keyword}});
            
            const me = await this.getCredentialsByUserId(userid);
            const friendIds = me.friend_ids.map(id => id.toString());
            const friendIdsSet = new Set(friendIds);

   
            let res = []
            data.forEach(function(element) {
                let is_friend = false
                const username = element.username;
                const user_id = element.user_id.toString();
                console.log(`SERACHED USER ${element.user_id.constructor.name}`);
                if(friendIdsSet.has(user_id))
                {
                    console.log("HAKKP")
                    is_friend = true;
                }

                res.push({username, user_id, is_friend});
              }); 
            return response(200, 'Tweeten skapades', res);
        } 
        catch (err) { 
            Logger.error(err);
            console.log(err);
            return response(500, 'Invalid search',[]);
        }
    }

    //NEW
    async getPostIds(userid) {
        const user     = await this.api.getEntry({ "user_id": ObjectID(userid) });
        const post_ids = user.post_ids;
        return post_ids;
    }

    async getUserByUsername(username) {
        const user = await this.api.getEntry({"username": username});
        if (!user) { return null; }
        return user 
    }

    async getCredentialsByUsername(username) {
        const user = await this.api.getEntry({"username": username});
        if (!user) { return null; }
        return user 
    }

    async getCredentialsByUserId(userId) {
        const user = await this.api.getEntry({"user_id": ObjectID(userId)});
        if (!user) { return null; }
        return user 
    }

    // retunerar {post: ..., from: ..., to: ... }
    async joinWithPosts(posts) {
        let checkedUsers = {};
    
        const joins = await Promise.all(posts.map(async (post) => {
            let result = {post: Object.assign({}, post)}
            const userId = post.user_id;
            const targetUserId = post.target_user_id;

            if (checkedUsers[userId]) {
                result.from = checkedUsers[userId]
            } else {
                const userData = await this.getCredentialsByUserId(userId);
                checkedUsers[userData.user_id] = userData 
                result.from = userData;
            }

            if(checkedUsers[targetUserId]) {
                result.to = checkedUsers[targetUserId];
            } else {
                const userData = await this.getCredentialsByUserId(targetUserId);
                checkedUsers[userData.user_id] = userData 
                result.to = userData
            }

            return result;
        }))
        return joins;
    }
}

module.exports = {UserManager};