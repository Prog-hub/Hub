const Logger     = require('../utility/logger.js')

function alreadyAuthenticatedCheck(req, res, next) {
    if (req.session.cookie.loggedin) {
        Logger.debug(email + "ALREADY LOGGED IN")
        res.send("Already logged in");
        res.end();
    } else {
        next();
    } 
}

function authCredentialsProvided(req, res, next) {
    const email    = req.body.email;
    const password = req.body.password;
    
    if (email && password) { 
        next();
    } else {
        res.status(403);
        res.send('Please enter Username and Password!');
        res.end();
    }
}

function authenticateMiddleware(req, res) {

    const result   = req.authResult;
    const email    = req.body.email;
    const password = req.body.password;
    res.status(result.code);
    if (result.code == 403) {

        res.send('Incorrect Username and/or Password!'); 

    } else if (result.code == 200) {
        
        req.session.user_id = result.body.data._id;
        req.session.username = result.body.data.username;

        Logger.info(email, "is logged in");
        

        req.session.loggedin = true;
        req.session.email    = email;

        res.cookie("auth", true, {...req.cookie, httpOnly:false});
        res.json(result.body.data);

    } else {
        res.send('Something wen very wrong!');
    }

    res.end();
}

module.exports = { alreadyAuthenticatedCheck, authenticateMiddleware, authCredentialsProvided }

