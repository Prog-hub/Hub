import React, {useState, useEffect} from 'react';
import styles from 'Styles/credentials_component.css';
import sharedStyles from 'Styles/shared.css';
import store from 'Utility/store';

function CredentialsComponent(props: any) {
    
    const [showMyStuff, setShowMyStuff] = useState(false);

    const username = props.username;
    const email    = props.email;

    async function getLoggedInInfo(){
       const id = store.getUserId();
        setShowMyStuff(props.user_id == id);
    }

    useEffect(() => {
        getLoggedInInfo();
    });

    return ( 
        <div id={styles.credentials_container}>
            {showMyStuff ? <p className={sharedStyles.container_title}>Your stuff</p> : <p className={sharedStyles.container_title}>Their stuff</p> }
            <div id={styles.credentials_card}>
                <p>{"Username: " + username}</p>
                <p>{"Legit email: " + email}</p>
            </div>
        </div>
    );
}

export default CredentialsComponent;