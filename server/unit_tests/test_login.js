const assert = require('chai').assert;
    
module.exports = async function ()  {
    const input_data = {
        email:    'test4@testsson.se',
        username: 'Testsson',
        password: 'testtest'
    };

    before(async () => {

        // ====== register a user function
        const entry = await this.authManager.createAccount(input_data.email, input_data.username, input_data.password);
        assert.equal(entry.code, 200);
        await this.userManager.createUser(entry.body.data._id, entry.email, entry.username); //user_id, mail, username
        // ========

    })


    it('logs a registered user in', async () =>  {
        const logged_in_response = await this.authManager.login(input_data.email, input_data.password);
        assert.equal(logged_in_response.code, 200)
        assert.equal(logged_in_response.body.data.username, input_data.username)
        assert.equal(logged_in_response.body.data.email, input_data.email)
    })

    it('fails to Login a registered user using wrong password', async () =>  {
        const logged_in_response = await this.authManager.login(input_data.email, "Bamseärstor");
        assert.equal(logged_in_response.code, 403)
        assert.equal(logged_in_response.body.message, 'Wrong password')
        assert.isNull(logged_in_response.body.data)
    })

    it('fails to Login a registered user with 500 error using a wrong email datastructure', async () =>  {
        const logged_in_response = await this.authManager.login([input_data.email], "Bamseärstor");
        assert.equal(logged_in_response.code, 403)
        assert.equal(logged_in_response.body.message, 'Email does not exist')
        assert.isNull(logged_in_response.body.data)
    })

}