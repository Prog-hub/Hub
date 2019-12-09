const assert = require('assert');
const uuidv1 = require('uuid/v1');

const HubManager  = require('../managers/hub_manager').HubManager
const AuthManager = require('../managers/auth_manager').AuthManager
const UserManager = require('../managers/user_manager').UserManager
const ChatManager = require('../managers/chat_manager').ChatManager

const ApiFunctions = require('../api_functions');

const Mongo  = require('../mongo/mongo.js')
const Logger = require('../utility/logger.js')

var cors     = require('cors')
var express  = require('express')
var app      = express()
//chat
const http = require('http').Server(app);
const io = require('socket.io')(http);


const require_login     = require('../middlewares/validation-mw').require_login;
const require_is_friend = require('../middlewares/validation-mw').require_is_friend;
const post_in_bound     = require('../middlewares/bound-mw').post_in_bound;

const fix_search = require('../middlewares/search-mw').fix_search;

const cookieParser  = require('cookie-parser');
const session       = require('express-session');

const appconfig = require('../appconfig');

const ChatSocket = require('../ChatSocket');

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//const andreas_ip     = '10.242.34.132';

process.env.NODE_ENV = "debug"
const config = appconfig['test']; // process.env.SERVER_ENV
const SERVER_ADDRESS = config.ip;//process.env.HOST_IP;//'10.242.34.255';
const db_config = config.db;
const PORT = process.env.PORT = config.port 

function genuuid() { return uuidv1(); }



// https://dev.to/jcolborndropdeadgames/user-authentication-with-expressjs-44od
(async() => {
    
    const database_api        
        = new Mongo(
            db_config.url,
            db_config.db_name, db_config.hub_collection_name,
            db_config.auth_collection_name, 
            db_config.user_collection_name, 
            db_config.chat_collection_name);

    const hub_collection_api  = await database_api.initialize_hub();  // mongo_api
    const auth_collection_api = await database_api.initialize_auth(); // mongo_api 
    const user_collection_api = await database_api.initialize_user();
    const chat_collection_api = await database_api.initialize_chat();

    const hubManager          = new HubManager(hub_collection_api);
    const authManager         = new AuthManager(auth_collection_api);
    const userManager         = new UserManager(user_collection_api);
    const chatManager         = new ChatManager(chat_collection_api);

    const apiFunctions        = new ApiFunctions(authManager, hubManager, userManager, chatManager);
    
    const chatSocket          = new ChatSocket(io, apiFunctions);
    chatSocket.init()
   // await AuthManager.connectToDb();
    app.use(cors({
        "credentials": true,
        "origin": [`http://${SERVER_ADDRESS}:9001`, `http://10.242.34.132:9001`],
        "methods": "GET, POST, PUT",
        "allowedHeaders": "Origin, X-Requested-With, Content-Type, Accept",
        "preflightContinue": true
    }));

    app.use(cookieParser());
    app.use(session({
        genid: function(req) {
            return genuuid() // use UUIDs for session IDs
        },
        secret: 'iamverydamneirnqweomsn',
        resave: true,
        saveUninitialized: true,
        cookie: { maxAge: 30 * 86400 * 1000 }
    }));
   
    // app.use((function(req, res, next) {
    //     res.header("Access-Control-Allow-Credentials", 'true');
    //     res.header("Access-Control-Allow-Origin", "http://localhost:9001");
    //     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //     next();
    // }));

    app.post('/auth', async function(request, response) {
        var email    = request.body.email;
        var password = request.body.password;

        if (request.session.cookie.loggedin) {
            console.log(email + "ALREADY LOGGED IN")
        }

        if (email && password) {
            // bcrypt implementationen i authManager
            const result = await apiFunctions.auth(email, password); // Bcrypt här
            
            if (result.code == 500) {
                response.send('Incorrect Username and/or Password!');
                return
            } 

            if (result.code == 200) {
               
                request.session.user_id = result.body.data._id;
                request.session.username = result.body.data.username;

                console.log(email, "is logged in");
               
                response.status(result.code)

                request.session.loggedin = true;
                request.session.email    = email;

                // Gjorde den här för clienten
                response.cookie("auth", true, {...request.cookie, httpOnly:false});
                response.json(result.body.data);

            } else {
                response.send('Incorrect Username and/or Password!');
            }
	
            response.end();

        } else {
            response.send('Please enter Username and Password!');
            response.end();
        }
    });

    // https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
  
    // NEW
    app.post("/create-account", async function(req, res){
        const result = await apiFunctions.createAccount(req.body)
        res.status(result.code);
        res.json(result.body);
    });

    // NEW
    app.get("/logout", async function(req, res){
        req.session.loggedin = false;
        console.log("Logged out");
        res.clearCookie('auth', {httpOnly:false});
        res.send('Logged out');
        res.end();
    });

    // NEW
    app.get("/credentials", require_login, async function(req, res){
        const username = req.session.username;
        const responseData = await apiFunctions.credentials(username);
        
        res.status(200);
        res.json(responseData);
    });

    //NEW
    app.get('/info', require_login, async function(req, res) {
        res.status(200)
        res.json({user_id: req.session.user_id, username: req.session.username})
    })

    //NEW   
    app.get("/credentials/user/:username", require_login, async function(req, res){
        const username     = req.params.username;
        const responseData = await apiFunctions.credentials(username, req.session.user_id);
        
        res.status(200);
        res.json(responseData);
    });

    //NEW   
    app.get("/credentials/id/:user_id", require_login, async function(req, res){
        const userId       = req.params.user_id;
        const responseData = await apiFunctions.credentialsById(userId, req.session.user_id)
        res.status(200);
        res.json(responseData);
    });


    //NEW
    app.get('/posts', require_login, async (req, res) => { // require is friends
        const loggedin_user_id  = req.session.user_id;
        // TODO: kolla om ni är vänner först
        const postUserJoin = await apiFunctions.posts(loggedin_user_id)
        // TODO: PLOCK UT MAKER OCH TARGET och gör en response som bygger på text
        res.json(postUserJoin)
    });

    //NEW 
    app.get('/posts/:user_id', 
      require_login, 
      (req, res, next) => require_is_friend(req, res, userManager, req.params.user_id, next),
      async (req, res) => { // require is friends
      
        const target_user_id   = req.params.user_id;
        const loggedin_user_id = req.session.user_id;
        if (target_user_id == loggedin_user_id) {
            // KOLLA INTE OM VI ÄR VÄNNER
        }
        // TODO: kolla om ni är vänner först
        
        const postUserJoin = await apiFunctions.posts(target_user_id)
        //const postInfo = await userManager.ge
        // TODO: PLOCK UT MAKER OCH TARGET och gör en response som bygger på text
        res.json(postUserJoin)
    });

    //NEW
    app.get("/search-user", require_login, fix_search , async function(req, res) {
        const user_id = req.session.user_id;
        const query  = req.query.keyword;
        const result = await apiFunctions.searchUser(query, user_id);
        //get friends
        res.status(result.code)
        res.json(result.body)
    })

    app.get("/add-friend/:friend_id", require_login, async function(req, res){
            //req.body.id
        const userId   = req.session.user_id;
        const friendId = req.params.friend_id;
       
        const result   = await apiFunctions.addFriendId(userId, friendId);
        res.status(result.code)
        res.json(result.body)

    })

    app.get("/friends/:user_id", require_login, async function(req, res){
            //req.body.id
        const id     = req.params.user_id;
        const result = await apiFunctions.friends(id);
        //TODO WASH MACHINE TILL RESPONSE MODEL clienten vill inte bära friends friends osv
        res.status(200);
        res.json(result);            
    })

    app.get("/profile/:id", require_login, async function(req, res){})

    //NEW, TARGET USER ID OCH TEXT och va inloggad
    app.post("/create-post", 
      require_login, 
      (req, res, next) => require_is_friend(req, res, userManager, req.body.target_user_id, next), 
      post_in_bound, 
      async function(req, res) {
        //res.send("Tweeten är sparad");
        const target_user_id = req.body.target_user_id; //Variabler eller ej?
        const data = await apiFunctions.createPost(req.body.text, req.session.user_id, target_user_id);

        if (data) {
            res.status(200);
            res.json(data);
        } else {
            res.status(500);
            res.end();
        }
    });


    app.get('/find-chat/:friend_id', require_login, async (req, res) =>  { // returnerar chatId som användaren kan joina på
        const chatData = await apiFunctions.findChat(req.session.user_id, req.params.friend_id);
        res.json(chatData)
    })

    app.get('/get-chat-notifications', require_login, async (req, res) => {
        const chats = await apiFunctions.getChatNotifications(req.session.user_id);
        res.json(chats);
    });


    // app.get('/flag-chat/:chatId', require_login, async (req, res) => {
    //     const chatId = req.params(chatId);

    //     await this.apiFunctions.flagChat(chatId);
    // });


    app.get('/404', function(req, res) {
        res.sendStatus(404);
    });




    app.use(function(err, req, res, next) {
        console.error(err.stack);
        res.sendStatus(500);
    });

    function send405(req, res) { res.sendStatus(405); }
    
    http.listen(PORT, SERVER_ADDRESS, () => {
        Logger.debug('Server is running at PORT', PORT);
    });

    //app.keepAliveTimeout = 60000 * 2;
})();