import React , {useContext} from 'react';
import sharedStyles from 'Styles/shared.css';
import user from 'Network/user';
import ProfileContext from 'Context/profile_context';
type Props = {
    is_friend: bool,
    user_id: string
}

function AddFriendButtonComponent(props: Props) { // skicak is friends i props

    const profileContext = useContext(ProfileContext);

    async function addFriend() {
        const friendid = props.user_id;
        await user.addFriend(friendid);

        showFeedback();
    }

    function showFeedback(){
        profileContext.didAddFriend();
        profileContext.setWarning({isVisible: true, text: "Friend was added"});
        
    }
    
    const visibleButton = (props.is_friend || props.is_friend == null) ? false : true;
    return visibleButton ?  ( 
       <button type="submit" className={[sharedStyles.cool_post_button, sharedStyles.flex_centered_element].join(' ')} onClick={(e) => addFriend(e)} >Add friend</button> 
    ) : null;

}

export default AddFriendButtonComponent;