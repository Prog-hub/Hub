
import {server as networkConfig} from 'Network/networkconfig.js';

const _PROTOCOL   = `${networkConfig.protocol}://`;
const _SERVER_URL = networkConfig.ip;//'127.0.0.1';//'10.242.34.255';
const _PORT       = `:${networkConfig.port}`; 
const _REQUEST    = _PROTOCOL + _SERVER_URL + _PORT;

type Request_routes_Type = { auth: string, create_account: string, logout: string, friend_list: string};

function url_query(data) {
    let params_str = "?";
    for (let key in data) { 
        if (data[key]) {
            if(params_str.length > 1) { params_str += "&"; }
            params_str += key + "=" + data[key];
        }
    }
    return params_str;
}

function url_params(params) {
    let result = "";
    params.forEach(param => {
        result += `/${param}`;
    });
    return result;
}


const _request_routes: Request_routes_Type = { 
    auth:           '/auth', 
    create_account: '/create-account',
    logout:         '/logout',
    friend_list:    '/friends',
    credentials:    '/credentials/id',
    posts:          '/posts',
    search_user:    '/search-user',
    add_friend:     '/add-friend',
    info:           '/info',
    create_post:     '/create-post',
    get_chat_notifications: '/get-chat-notifications',
    find_chat: '/find-chat',
    flag_chat: '/flag-chat' 
};

function create_account(){
    return _REQUEST + _request_routes.create_account;
}    

function authenticate() {
    return _REQUEST + _request_routes.auth;
}

function logout (){
    return _REQUEST + _request_routes.logout;
}

function friend_list(user_id) {
    return _REQUEST + _request_routes.friend_list + url_params([user_id]); 
}

function credentials(user_id) {
    return _REQUEST + _request_routes.credentials + url_params([user_id]);
}

function search_user(keyword){
    return _REQUEST + _request_routes.search_user + url_query({keyword});
}

function posts() {
    return _REQUEST + _request_routes.posts;
}

function posts_user(user_id) {
    return _REQUEST + _request_routes.posts + url_params([user_id]);
}

function create_post(){
    return _REQUEST + _request_routes.create_post;
}

function add_friend(friend_id){
    return _REQUEST + _request_routes.add_friend + url_params([friend_id]); 
}
function get_info() {
    return _REQUEST + _request_routes.info;
}

function find_chat(id){
    return _REQUEST + _request_routes.find_chat + url_params([id]);
}

function get_chat_notifications(){
    return _REQUEST + _request_routes.get_chat_notifications;
}

function flag_chat(){
    return _REQUEST + _request_routes.flagChat;
}


export default {
    authenticate,
    create_account,
    logout,
    friend_list,
    credentials,
    posts,
    posts_user,
    search_user,
    add_friend,
    get_info,
    create_post,
    find_chat,
    get_chat_notifications,
    flag_chat
};