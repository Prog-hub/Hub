import url from 'Network/url.js';


class Chats{
    async findChat(friendId){ // requestchat
        const response = await fetch(url.find_chat(friendId), {method: 'get', credentials: 'include'});
        return await response.json();
    }

    async getChatNotifications(){
        const response = await fetch(url.get_chat_notifications(), {method: 'get', credentials: 'include'});
        if (!response.ok) { return []; } // TODO: null istället
        return await response.json();
    }
}




const chats = new Chats();
export default chats;