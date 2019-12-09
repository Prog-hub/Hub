const ObjectID = require('mongodb').ObjectID;
const Mongo = require('../mongo/mongo')
const Logger = require('../utility/logger')
const bcrypt = require('bcrypt')

const saltRounds = 10;

function response(code, message, data = null) { return { code, body: {message, data} } }

function authEntry(email, username, password) {
    return { email, username, password }
}

class AuthManager {

    constructor(api) {
        this.api = api; //ett interface
    }

    async _hash(password) {
        return new Promise((resolve, reject)=>{
            bcrypt.hash(password, saltRounds, function(err, hash) {
                if(err) {
                    reject(err)
                } else {
                    resolve(hash)
                }
            });
        })
    } 

    validateEmail(email) {
        const re = /[^@]+@[^\.]+\..+/;
        return re.test(email);
    }

    validatePassword(password) {
        const re = /^.{6,16}$/g;
        return re.test(password) 
    }

    async createAccount(email, username, password) {

        try { 
            if(!this.validateEmail(email))
            {
                return response(400, 'Not a valid email');
            }

            if(!this.validatePassword(password)) 
            {
                return response(400, 'Not a valid password');
            }

            const user_with_same_email    = await this.api.getEntry({email});
            const user_with_same_username = await this.api.getEntry({username});
            // account already exist?
            // döda om user_with_same_email redan finns
            if(user_with_same_email)
            {
                return response(409, 'Email already exists');
            }

            if(user_with_same_username) 
            {
                return response(409, 'Username needs to be unique');
            }

            const hashed_password = await this._hash(password)
            const data = await this.api.insertEntry(authEntry(email, username, hashed_password));
            const res = data.ops[0];
            return response(200, 'Account created', res);
        } 
        catch (err) { 
            Logger.error(err);
            return response(500, 'Failed to create account');
        }
    }

    async login(email, password) {
        try { 
            const data = await this.api.getEntry({email}); 
            if (data) {
                const match = await bcrypt.compare(password, data.password);

                if(match)  {
                    return response(200, 'Login success', data);
                } else {
                    return response(403, 'Wrong password');
                }

            } else {
                return response(403, 'Email does not exist')
            }

        } catch (err) { 
            Logger.error(err);
            return response(500, 'Failed to login');
        }
    } 


    async getCredentials(user_id){
        try { 
            const result = await this.api.getEntry({_id: user_id});
            if(result)  {
                const data = {email :result.email, username :result.username};
                return response(200, 'Credentials found', data);
            } else {
                 return response(403, 'Credentials not found');
            }  
        }
        catch (err) {
            Logger.error(err);
            return response(500, "Server failed to get credentials")
        }
    }
}



module.exports = { AuthManager }  