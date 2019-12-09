import url from 'Network/url.js';

// https://stackoverflow.com/questions/33913758/express-session-isnt-setting-session-cookie-while-using-with-socket-io
class Hub {
    async createPost(text, target_user_id){
        const response = await fetch(url.create_post(), {method: 'post', mode: 'cors', 
        headers: {'content-type': 'application/json'}, body: JSON.stringify({text, target_user_id}), 
        credentials: 'include', crossDomain: true});
        if(response.ok) {
            return await response.json();
        } else {
            return null;
        }
    }

    async getPosts(user_id) {
        const response = await fetch(url.posts_user(user_id), {method: 'get', credentials: 'include'});
        if (!response.ok) { return []; } // TODO: null istället
        return await response.json();
    }
}

const hub = new Hub();
export default hub;