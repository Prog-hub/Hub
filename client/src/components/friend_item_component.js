import React from 'react';
import styles from 'Styles/friend_item_component.css';
import { Link } from 'react-router-dom';

type Props = {
    email: string,
    user_id: string,
    username: string,
    online: boolean
};

function FriendItemComponent(props: Props) {
    return (<Link to={`/profile/${props.user_id}`}> 
        <li className={styles.cool}>
            <p>{props.username}</p>
        </li>
        </Link>);
}

export default FriendItemComponent;