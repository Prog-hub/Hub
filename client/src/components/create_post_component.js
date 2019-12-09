import React, {useState, useContext, useEffect} from 'react';
import styles from 'Styles/create_post_component.css';
import hub from 'Network/hub';

import ProfileContext from 'Context/profile_context';
import sharedStyles from 'Styles/shared.css';
import store           from 'Utility/store';

function CreatePostComponent(props: any) {

    const profileContext = useContext(ProfileContext);

    const [postText, setPostText]    = useState("");
    const [isVisible, setIsVisible ] = useState(store.getUserId() == props.user_id);

    async function makePost() {
        if(postText.length > 140) {
            profileContext.setWarning({isVisible: true, text: "Too many characters"});
            return;
        }
        else if(postText.length == 0){
            profileContext.setWarning({isVisible: true, text: "Too few characters"});
            return;
        }
        profileContext.setWarning({isVisible: false, text: ""});
        const result = await hub.createPost(postText, props.user_id);
        if(result) {
            setPostText("");
            await profileContext.didCreatePost();
        } else {
            profileContext.setWarning({isVisible: true, text: "Something went wrong"});
        }
    }

    function setVisibility() {
        setIsVisible(store.getUserId() != props.user_id && props.is_friend ); 
    }

    useEffect(() => {
        setVisibility();
    }, [props.user_id, props.is_friend]);

    return  isVisible?  (
        <div id={styles.post_item_container}>
            <textarea value={postText} onChange={(e) => setPostText(e.target.value)} placeholder="post something beutiful or not MAX 140 " rows="4" cols="0"></textarea>
            <button type="submit" id="create-post-button" className={sharedStyles.cool_post_button} onClick={(e) => makePost(e)}>Post</button> 
        </div>
    ): null;
}

export default CreatePostComponent;