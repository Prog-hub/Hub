const {Builder, By, Key, until} = require('selenium-webdriver');

async function createUser(users, driver, testIp){
    const testuser = "testuser"
    const testemail = "test@test.test"
    const testpassword = "password"

    try{
        for(let i = 0; i < users; i++){        
            await driver.get(testIp + '/register');
            await driver.findElement(By.id('username')).sendKeys(testuser + i.toString());
            await driver.findElement(By.id('email')).sendKeys(testemail + i.toString());
            await driver.findElement(By.id('password')).sendKeys(testpassword);
            await driver.findElement(By.id('rePassword')).sendKeys(testpassword, Key.RETURN);
        }
    }
    catch(e){
        console.log(e);
    }
}

module.exports = createUser