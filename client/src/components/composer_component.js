import styled from 'styled-components';
import React, {useState} from 'react';


const Input = styled.input`
    display:flex;
    flex: 3;
`;

const Wrapper = styled.div `
    display: flex;
    flex-direction: row;
    flex-grow; 1;
    height: 100px;
`;

const Button = styled.button `
    display: flex;
    background-color: cornflowerblue;
    color: #eeeeee;
    flex: 1;
    align-items: center;
    justify-content: center;
`;

const Form = styled.form `
    display: flex;
    flex: 1;
`;

function Composer(props: any) {
    const [message, setMessage] = useState('');
    return ( 
        <Wrapper>
            <Form>
                <Input value={message} onChange={(e) => {
                    setMessage(e.target.value);
                }}/>
                <Button type="submit" onClick={(e)=> {
                    e.preventDefault();
                    props.onSendMessage(message);
                    setMessage('');
                }}>Send</Button>
            </Form>
        </Wrapper>
    );
}

export default Composer;