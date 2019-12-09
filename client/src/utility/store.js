

function getUserId() {
    return localStorage["auth_user_id"];   
}

function setUserId(uId) {
    localStorage["auth_user_id"] = uId;
}

export default {getUserId, setUserId};