import React, {useState, useEffect, forwardRef, useImperativeHandle} from 'react';
import styles from 'Styles/friend_list_component.css';
import user from 'Network/user';
import FriendItemComponent from 'Components/friend_item_component';
type Props = {
     user_id: string
};
    
function FriendListComponent(props: Props, ref) {
    
    const [friendList, setFriendList] = useState([]);
    
    async function fetchData() { 
        let friendsData = await user.getFriendList(props.user_id);
        setFriendList(friendsData);
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
        <div id={styles.list_container}>
            <p>{friendList.length == 0 ? 'It looks empty in here You need to search for some friends' : 'Friends'}</p>
            <ul className={styles.list}>
                {friendList.map((data, i) => <FriendItemComponent key={i} {...data} /> ) }
            </ul>
        </div>
    );
}

export default forwardRef(FriendListComponent);