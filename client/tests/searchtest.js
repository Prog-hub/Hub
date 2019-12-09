const {Builder, By, Key, until} = require('selenium-webdriver');
const assert = require('assert');



async function testSearch(driver){
    const keyword = "test";
    const index = 0;


    //warning could be tested also
    try{
        await driver.findElement(By.id('searchfield')).sendKeys(keyword);
        await driver.sleep(300);

        const container = await driver.findElement(By.id('result_container'));
        const results = await container.findElements(By.xpath("*"));
        await driver.sleep(300);
        assert.equal(results.length > 0, true);


        const btn = await results[index].findElement(By.tagName("button"));
        await btn.click();

        await driver.sleep(300);

        const message = await driver.findElement(By.tagName("p"));
        assert.equal(await message.getAttribute('innerHTML'),"Friend was added");

        const findbtn = await results[index].findElements(By.tagName("button"));
        const hasbtn = findbtn.length != 0; 
        assert.equal(hasbtn, false);
    }
    catch(e){
        console.log(e);
    }
}

async function start(driver, testIp){
    try{
        await driver.get(testIp + '/search');
        await testSearch(driver);
    }
    catch(e){
        console.log(e);
    }
}


module.exports = start;