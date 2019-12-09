import React, {useState} from 'react';
import sharedStyles from 'Styles/shared.css';
import { Redirect } from 'react-router-dom';
import store           from 'Utility/store';
import chats from 'Network/chats';


type Props = {
    is_friend: bool,
    user_id: string
}

function ChatButtonComponent(props: Props){
    const [chatId, setChatId] = useState(null);

    async function getChatId() {
        const chatData = await chats.findChat(props.user_id);
        setChatId(chatData._id);
    }

    function render() {
        if(!chatId) {
            return (
                <button onClick={getChatId} className={[sharedStyles.cool_post_button, sharedStyles.flex_centered_element, sharedStyles.centered].join(' ')}>
                    CHAT!!!
                </button>
            );    
        } else {
            return (<Redirect to={`/chat/${chatId}`}/>);
        }
    }

    return props.is_friend && props.user_id != store.getUserId()? ( 
        render()
    ) : null;
}

export default ChatButtonComponent;