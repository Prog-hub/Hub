import React, {useState, useEffect, forwardRef, useImperativeHandle} from 'react';
import hub from 'Network/hub';
import PostItemComponent from 'Components/post_item_component';
import styles from 'Styles/postlist_component.css';

type Props = {
    user_id: string
};

function PostListComponent(props: Props, ref) {
    
    const [posts, setPosts] = useState([]);
    
    async function fetchData() {
        const data = await hub.getPosts(props.user_id);
        setPosts(data);
    }

    useEffect(() => {
        fetchData();
    }, [props.user_id]);
    
    //exposing these stuff to res
    useImperativeHandle(ref, () => ({
        refresh() {
            fetchData();
        }
    }));
    
    return ( 
        <div id={styles.postlist_container} className="post_container">
            { posts.map((item, i) => <PostItemComponent key={i} {...item} />) }
        </div>
    );
}

export default forwardRef(PostListComponent);