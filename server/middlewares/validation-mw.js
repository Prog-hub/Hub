

function require_login(req, res, next) {
    if (req.session.loggedin) { next(); return; } 
    res.status(403);
    res.end();
}

function require_admin(req, res, next) {
    if (req.session.loggedin && req.session.isadmin) { next(); }
    res.status(403);
    res.end();
}

function require_is_friend(req, res, userManager, tId,next) {
    const uId = req.session.user_id;
    if(tId == uId) { next() }
    else {
        userManager.are_friends(uId, tId)
        .then((friends) => {
            if (friends) {
                next()
            } else {
                res.status(403);
                res.end();
            }
        })
    }
}

module.exports = { require_login, require_is_friend };