import url from 'Network/url.js';

// https://stackoverflow.com/questions/33913758/express-session-isnt-setting-session-cookie-while-using-with-socket-io
class Auth {
    async login(email: string, password: string) {
        const response = await fetch(url.authenticate(), {method: 'post', mode: 'cors', 
        headers: {'content-type': 'application/json'}, body: JSON.stringify({email, password}), 
        credentials: 'include', crossDomain: true});
        return response.ok;
    }

    async createAccount(username: string, email: string,  password: string) {
        const response = await fetch(url.create_account(), {method: 'post', mode: 'cors',
        headers: {'content-type': 'application/json'}, body: JSON.stringify({username, email, password}), xhrFields: {
                withCredentials: true
            },crossDomain: true});
        return await response.json();
    }

    async logout(){
        try {
            const response = await fetch(url.logout(), {method: 'get',  credentials: 'include'});
            return response.ok;
        } catch(err) {
            return false;
        }
    }


    async getCredentials(userId){
        const response = await fetch(url.credentials(userId), {method: 'get',  credentials: 'include'});
        const data = await response.json();
        return data;
    }

}

const auth = new Auth();
export default auth;