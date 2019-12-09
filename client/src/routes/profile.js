import React, {useState, useEffect, useRef} from 'react';
import styles from 'Styles/profile.css';

import PostListComponent        from 'Components/postlist_component';
import FriendListComponent      from 'Components/friendlist_component';
import WarningComponent         from 'Components/warning_component';
import ProfileContext           from 'Context/profile_context';
import ProfileOverviewComponent from 'Components/profile_overview_component';

function Profile(props: any) {
    const [, setUserId] = useState(props.match.params.user_id);
    const [warning, setWarning] = useState({isVisible: false, text: "OMG STOP"});
    const postListComponentRef        = useRef();
    const profileOverviewComponentRef = useRef();
    const friendListComponentRef      = useRef();

    useEffect(() => { 
        setUserId(props.match.params.user_id);
        setWarning({isVisible: false, text: "OMG STOP"});
        }, [props.match.params.user_id]);

    function didCreatePost() {
        postListComponentRef.current.refresh();
    }
 
    function didAddFriend(){
        profileOverviewComponentRef.current.refresh();
        friendListComponentRef.current.refresh();
        postListComponentRef.current.refresh();
    }

    return (
        <ProfileContext.Provider value={{warning: warning, setWarning, didCreatePost, didAddFriend}}>
            <div className={styles.profile_wrapper}>
                <div className={styles.profile_content_section}>
                    {warning.isVisible ? <WarningComponent {...warning}/> : null}
                    <ProfileOverviewComponent ref={profileOverviewComponentRef} {...props.match.params}   />
                    <PostListComponent ref={postListComponentRef}  {...props.match.params} />
                </div>
                <div className={styles.friendlist_section}>
                    <FriendListComponent  ref={friendListComponentRef} {...props.match.params} />
                </div>
            </div>
        </ProfileContext.Provider>
      );
}

export default Profile;