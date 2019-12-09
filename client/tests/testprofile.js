const {Builder, By, Key, until} = require('selenium-webdriver');
const assert = require('assert');


async function getPostList(driver){
    const postList = await driver.findElement(By.className("post_container"));
    
    const posts = await postList.findElements(By.xpath("*"));

    return posts;
}

async function testPost(driver){
    const message = "TJENARE MANNEN";

    const posts = await getPostList(driver);
    const oldSize = posts.length;
    const postInput = await driver.findElement(By.css("textarea"));
    await driver.sleep(1000);
    const postBtn = await driver.findElement(By.id("create-post-button"));
    await postInput.sendKeys(message);
    await postBtn.click();

    await driver.sleep(200);
    const updatedPosts = await getPostList(driver);
    assert.equal(oldSize + 1, updatedPosts.length);

    await driver.sleep(200);
}

async function testProfile(driver){

    //0 is nav
    const friendlist = (await driver.findElements(By.tagName("ul")))[1];
    await driver.sleep(200);
    const friends = await friendlist.findElements(By.xpath("*"));
    
    assert.equal(friends.length > 0, true);

    await friends[0].click();
    await testPost(driver);
}

async function start(driver, testIp){
    try{
        await driver.get(testIp + '/profile/');
        await testProfile(driver);
        await driver.sleep(1000);
    }
    catch(e){
        console.log(e);
    }
}

module.exports = start;
