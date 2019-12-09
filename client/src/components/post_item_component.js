import React, {useContext} from 'react';
import styles from 'Styles/post_item_component.css';
import { Link } from 'react-router-dom';
import AppContext from 'Context/app_context.js';


function identity(loggedInUserId, otherUserId, username) {
    if(otherUserId == loggedInUserId) {
        return "ME!";
    } else {
        return username;
    }
}

function PostItemComponent(props: any) {
    const appState = useContext(AppContext).state;

    function date() {
        if (props.post.date) {
            return (new Date(props.post.date)).toDateString();
        }

        return "";
    }


    return (
        <div className={styles.post_item_container}>
            <div className={styles.top_section}>
                <div>
                    <Link to={`/profile/${props.to.user_id}`}>{"To: " + identity(appState.userId, props.to.user_id, props.to.username)}</Link>
                    <br/>
                    <Link to={`/profile/${props.from.user_id}`}>{"From: " + identity(appState.userId, props.from.user_id, props.from.username)}</Link>
                </div>
                <div>
                    <p className={styles.card_date}>{date()}</p>
                </div>
            </div>
            <p>{props.post.text}</p>
        </div>
    );
}

export default PostItemComponent;