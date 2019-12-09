
function credentialsResponseFilter(object) {
     if (!object) { return null; }
     return { username: object.username, email: object.email, user_id: object.user_id };
}

function response(code, message, data = null) { return { code, body: {message, data} } }

module.exports = {
    credentialsResponseFilter,
    response
}
