import React, {useEffect} from 'react';
import styled from 'styled-components';


const TextArea = styled.textarea `
    display: flex;
    flex: 1;
    resize: none;
`;

function ChatlistComponent(props: any){
    
    useEffect(() => { 
        //if(props.messages.length > 0)
        //{
            document.getElementById("chatlist").scrollTop = document.getElementById("chatlist").scrollHeight;
        //}
    }, [props.messages]);


    return (
        <React.Fragment>
            <TextArea id="chatlist" value={props.messages.map(messageObj => `${messageObj.username}: ${messageObj.text}`).join('\n')} ></TextArea>
        </React.Fragment>
    );

}

export default ChatlistComponent;