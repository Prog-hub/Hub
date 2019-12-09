import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import styles from 'Styles/search.css';
import user from 'Network/user';
import InfoMessageComponent from 'Components/info_message_component';
import store from 'Utility/store';


function Search() {
  const [keyword, setKeyWord] = useState("");
  const [result, setSearchResults] = useState([]);
  const [messageVisible, setMessageVisible] = useState(false);
  const [myId, setMyId] = useState(false);

    async function update_search(value){
        setKeyWord(value);
        if(value.length > 3){
            const res = await user.getSearchUser(value);
            setSearchResults(res.data);
        }
        else{
            setSearchResults([]);
        }   
        
    }
    function getLoggedInInfo(){
        const id = store.getUserId();
        setMyId(id);
    }

    useEffect(() => {
        getLoggedInInfo();
    });

    function showMessage(){
     return messageVisible ? <InfoMessageComponent text={'Friend was added'} /> : null;
    }

    async function add_friend(e){
        const friendid = e.target.value;
        await user.addFriend(friendid);
        setMessageVisible(true);
        update_search(keyword);
    }

    return (
    <div className={styles.search_container}>
        {showMessage()}
        <input id="searchfield" placeholder="Make a search with more than 3 characters" value={keyword} onChange={(e) => update_search(e.target.value)} ></input>

        <div id="result_container" className={styles.result_container}>
            { 
                result.map((element,i) => {                   
                    return (<div className={styles.result} key={i}>
                        <Link to={`/profile/${element.user_id}`}> <p>{element.username}</p></Link>
                        {!element.is_friend && (element.user_id != myId) ? <button type="submit" value={element.user_id} onClick={(e) => add_friend(e)} >add friend</button> : null}
                        </div>);
                })
             }
        </div>
    </div>
    );
}


export default Search;