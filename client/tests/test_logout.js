const {Builder, By, Key, until} = require('selenium-webdriver');
const assert = require('assert');


async function testLogout(driver, testIp){
   
    await driver.get(testIp + "/profile/")
    logoutBtn = await driver.findElement(By.css("ul input"));

    const oldUrl = await driver.getCurrentUrl();

    await logoutBtn.click();
    await driver.sleep(100);
    const newUrl = await driver.getCurrentUrl();
    assert.equal(oldUrl != newUrl, true);
    
}

async function start(driver, testIp){
    try{
        await testLogout(driver, testIp);
        await driver.sleep(1000);
    }
    catch(e){
        console.log(e);
    }
}

module.exports = start;