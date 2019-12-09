import React, {useState, useEffect, forwardRef, useImperativeHandle}  from "react";
import CredentialsComponent         from 'Components/credentials_component';
import AddFriendButtonComponent     from "Components/add_friend_button_component";
import ChatButtonComponent          from "Components/chat_button_component";
import CreatePostComponent          from 'Components/create_post_component';
import styles                       from 'Styles/profile_overview_component.css';
//import sharedStyles                 from 'Styles/shared.css';
import auth                         from 'Network/auth';


function ProfileOverviewComponent(props: any, ref) {
    
    const [userData, setUserData] = useState(null);

    async function fetchData() {
        const creds =  await auth.getCredentials(props.user_id);
        setUserData(creds);
    }

    useEffect(() => {
        fetchData();
    }, [props.user_id]);

    useImperativeHandle(ref, () => ({
        refresh() {
            fetchData();
        }
    }));


    return (
        <div id={styles.profile_overview_container}>
            <div  className={[styles.top_section].join(' ')}>
                <CredentialsComponent {...userData}/>
                <AddFriendButtonComponent {...userData} />
                <ChatButtonComponent {...userData} />
            </div>
            <div className={styles.bottom_section}>
                <CreatePostComponent {...userData} />
            </div>
        </div>
    );
    
}

export default forwardRef(ProfileOverviewComponent);