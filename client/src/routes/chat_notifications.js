import React, {useState, useEffect} from 'react';
import chats from 'Network/chats';
import { Link } from 'react-router-dom';
import styles from 'Styles/chat_notifications.css';
import sharedStyles from 'Styles/shared.css';

function ChatNotifications(){

    const [notifications, setNotifications] = useState([]);

    
    useEffect(() => {fetchNotifications();}, []);


    async function fetchNotifications(){
        const chatData = await chats.getChatNotifications();
        setNotifications(chatData);
    }


    function items() {
        return notifications.map((post,i) => {
            return (
                <Link key={i} to={`/chat/${post._id}`}>
                    <li className={styles.chat_notification_item}>
                        <p>{post.peer_username}</p>
                    </li>
                </Link>
            );
        });
    }

    return (
        <div id={sharedStyles.chat_list_container}>
            <p className={sharedStyles.white_text}>Chats: </p>
            <ul id={styles.chat_list}>
                {items()}
            </ul>
        </div>
    );
}   

export default ChatNotifications;