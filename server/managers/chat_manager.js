const ObjectID = require('mongodb').ObjectID;

function hexToDec(s) {
    var i, j, digits = [0], carry;
    for (i = 0; i < s.length; i += 1) {
        carry = parseInt(s.charAt(i), 16);
        for (j = 0; j < digits.length; j += 1) {
            digits[j] = digits[j] * 16 + carry;
            carry = digits[j] / 10 | 0;
            digits[j] %= 10;
        }
        while (carry > 0) {
            digits.push(carry % 10);
            carry = carry / 10 | 0;
        }
    }
    return digits.reverse().join('');
}

function hash(a, b) {
    return (parseInt(hexToDec(a)) + parseInt(hexToDec(b))).toString(16);
}

function chatEntry(user_a, user_b, hashKey) {
    return {
        user_a: ObjectID(user_a),
        user_b: ObjectID(user_b),
        hash_key: ObjectID(hashKey),
        flag: false
        //multi: [user_a, user_b]
    }
} 

// https://stackoverflow.com/questions/4647348/send-message-to-specific-client-with-socket-io-and-node-js
class ChatManager {
    
    constructor(api){
        this.api = api;
        this._createChat = this._createChat.bind(this);
        this.requestChat = this.requestChat.bind(this);
        this.flagChat    = this.flagChat.bind(this);
    }

    async _createChat(userId, friendId, key){
        const data = await this.api.insertEntry(chatEntry(userId, friendId, key));
        return data.ops[0];
    }
    
    async requestChat(userId, friendId) {
        const key = hash(userId, friendId);
        const existingChat = await this.api.getEntry({hash_key: ObjectID(key)});
        if (existingChat) {
            return existingChat;
        } else {
            return this._createChat(userId, friendId, key);
        }
    } 

    async getAllFor(userId) {
        return await this.api.getEntries({ $or: [ { user_b: ObjectID(userId) }, { user_a: ObjectID(userId) } ] })
    }

    async flagChat(key){
        return await this.api.updateEntry({_id: ObjectID(key)}, {$set: { flag: true}});
    }

}

module.exports =  { ChatManager }