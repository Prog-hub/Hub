const {Builder, By, Key, until} = require('selenium-webdriver');
const assert = require('assert');

const username = "test@test.test0";
const password = "password";

async function login(driver, testIp) {
    try {
        await driver.get(testIp + '/login');

        await driver.findElement(By.id('email')).sendKeys(username);
        await driver.findElement(By.id('password')).sendKeys(password, Key.RETURN);
        await driver.sleep(300);
        return driver;
    }
    catch(e){
        console.log("ERROR: ===>");
        console.log(e);
    }

}

module.exports = login;