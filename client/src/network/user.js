import url from 'Network/url.js';

class User{
    async getFriendList(userId) {
        const response = await fetch(url.friend_list(userId), {method: 'get',  credentials: 'include'});
        return await response.json();
    }
    async getSearchUser(keyword){
        const response = await fetch(url.search_user(keyword), {method: 'get',  credentials: 'include'});

        return await response.json();
    }

    async getInfo() {
        const response = await fetch(url.get_info(), {method: 'get',  credentials: 'include'});
        if(!response.ok) { return null; }
        
        return await response.json();
    }
    async addFriend(friend_id){
        const response = await fetch(url.add_friend(friend_id), {method: 'get',  credentials: 'include'});

        return await response.json();
    }
}

const user = new User();
export default user;