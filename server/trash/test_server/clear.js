
const HubManager  = require('../managers/hub_manager').HubManager
const AuthManager = require('../managers/auth_manager').AuthManager
const UserManager = require('../managers/user_manager').UserManager
const Mongo  = require('../mongo/mongo.js')

const appconfig = require('../appconfig');



process.env.NODE_ENV = "debug"
const config = appconfig['test']; // process.env.SERVER_ENV
const db_config = config.db;



(async() => {
    

const database_api        = new Mongo(db_config.url,
db_config.db_name, db_config.hub_collection_name,
db_config.auth_collection_name, db_config.user_collection_name);
const hub_collection_api  = await database_api.initialize_hub();  // mongo_hub_api
const auth_collection_api = await database_api.initialize_auth(); // mongo_auth_api 
const user_collection_api = await database_api.initialize_user();
const hubManager          = new HubManager(hub_collection_api);
const authManager         = new AuthManager(auth_collection_api);
const userManager         = new UserManager(user_collection_api);


database_api.db.dropDatabase()
database_api.client.close()
console.log("cleared test db");

})()