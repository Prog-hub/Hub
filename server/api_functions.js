
const {credentialsResponseFilter, response} = require('./filter_models');

class ApiFunctions {
    constructor(authManager, hubManager, userManager, chatManager) {
        this.authManager = authManager;
        this.hubManager  = hubManager;
        this.userManager = userManager;
        this.chatManager = chatManager;
        
        this.createAccount   = this.createAccount.bind(this);
        this.credentials     = this.credentials.bind(this);
        this.credentialsById = this.credentialsById.bind(this);
        this.posts           = this.posts.bind(this);
        this.createPost      = this.createPost.bind(this);
    }

    async createAccount({email, username, password}) {
        const response = await this.authManager.createAccount(email, username, password);
        if (response.code == 200) 
        { 
            await this.userManager.createUser(response.body.data._id, email, username); 
        }
        return response;
    }

    async credentials(username, loggedInUId = null) {
        const userData     = await this.userManager.getCredentialsByUsername(username);
        const responseData = credentialsResponseFilter(userData);
        const logId = loggedInUId ? loggedInUId.toString() : null;
        const targetUId = userData.user_id.toString();
        responseData['is_friend'] = logId ==  targetUId ? true : userData.friend_ids.map(id=>id.toString()).includes(logId); //loggedInUId.toString() == userData.user_id.toString() ? true 
        return responseData;
    }

    async credentialsById(userId, loggedInUId = null) {
        const userData     = await this.userManager.getCredentialsByUserId(userId);
        const responseData = credentialsResponseFilter(userData);
        const logId = loggedInUId ? loggedInUId.toString() : null;
        const targetUId = userData.user_id.toString();
        responseData['is_friend'] = logId ==  targetUId ? true : userData.friend_ids.map(id=>id.toString()).includes(logId); //loggedInUId.toString() == userData.user_id.toString() ? true 
        return responseData;
    }

    async posts(user_id) {
        const post_ids     = await this.userManager.getPostIds(user_id);
        const posts        = await this.hubManager.getPosts(post_ids);
        const postUserJoin = await this.userManager.joinWithPosts(posts);
        return postUserJoin;
    }

    async createPost(text, user_id, target_user_id) {
        const data    = await this.hubManager.createPost(text, user_id, target_user_id);
        const post_id = await this.userManager.insertPost(data._id, user_id, target_user_id);
        return data;
    }

    async addFriendId(userId, friendId) {
        const user = await this.userManager.getCredentialsByUserId(userId);
        const friends = user.friend_ids.map(id => id.toString());
        if (!friends.includes(friendId.toString())) {
            return await this.userManager.addFriend(userId, friendId);
        } else {
            return response(304, "Already friends")
        }
    }

    async auth(email, password) {
        return await this.authManager.login(email, password);
    }

    async searchUser(query, userId) {
        return await this.userManager.search(query, userId);
    }

    async friends(id) {        
        return await this.userManager.getFriends(id);   
    }


    //CHAT

    async findChat(userId, friendId) {
        return await this.chatManager.requestChat(userId, friendId);
    }

    async getChatNotifications(userId) {
        const chats = await this.chatManager.getAllFor(userId);
        await Promise.all(chats.map(async (chatObject) => {
                let peerUserId;
                
                if(chatObject.user_a.toString() == userId.toString()) {
                    peerUserId = chatObject.user_b;
                } else {
                    peerUserId = chatObject.user_a;
                }
               const peer = await this.userManager.getCredentialsByUserId(peerUserId);
                chatObject.peer_username = peer.username;
            }
        ))

        return chats;
    }
    
    async flagChat(chatId) {
        return await this.chatManager.flagChat(chatId);
    }
}

module.exports = ApiFunctions;