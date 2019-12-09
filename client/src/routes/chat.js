import React, {useState, useEffect} from 'react';//, useEffect, useRef} from 'react';
//import styles from 'Styles/chat.css';
import sharedStyles from 'Styles/shared.css';

import openSocket from 'socket.io-client';
import {server as networkConfig} from 'Network/networkconfig.js';
import store           from 'Utility/store';
import ChatlistComponent from 'Components/chatlist_component';
import ComposerComponent from 'Components/composer_component';
const socket = openSocket(`${networkConfig.protocol}://${networkConfig.ip}:${networkConfig.port}`);

function Chat(props: any) {
    const chatId = props.match.params.chat_id;

    const [messages, setMessages] = useState([]);

    const userId = store.getUserId();

    function message_received(payload) {
        setMessages(oldMessages => [...oldMessages, payload]);
    }

    function offline_peer() {
        setMessages(oldMessages => [...oldMessages, {username: '', text: 'The user is offline'}]);
    }

    function error() {
     //socket.emit('request-chat', {userId: userId, friendId: friendUId});
    }

    useEffect(() => {
        socket.emit('chat', {chatId: chatId, userId: userId});
        
        socket.on('message-received', message_received);

        socket.on('offline-peer',offline_peer); 

        socket.on('error', error);
        return () => socket.emit('user-left', {chatId: chatId});
    }, []);

    function sendMessage(msg) {
        if(msg) {
            socket.emit('msg', {chatId: chatId, text: msg});
            setMessages(oldMessages => [...oldMessages, {username: 'jag', text: msg}]);
        }
    }
        
    return (
            <div className={[sharedStyles.height_fill_container].join(' ')}>
                <ChatlistComponent messages={messages}/>
                <ComposerComponent onSendMessage={sendMessage} />
            </div>
      );
}

export default Chat;