const {Builder, By, Key, until} = require('selenium-webdriver');
const assert = require('assert');


const validationTest = require('./login_register_test');
const login = require('./login');

const createUser = require('./create_user');

const searchTest = require('./searchtest');

const profileTest = require('./testprofile');

const logoutTest = require('./test_logout');

const testIp = `http://${process.env.HOST_IP}:9001`; //

const users = 5;

async function runTests(){
    
    const driver = await new Builder().forBrowser('firefox').build();

    try{
        await validationTest(driver, testIp);

        await createUser(users, driver, testIp);
        await login(driver, testIp);
        await searchTest(driver, testIp);
        await profileTest(driver, testIp);
        await logoutTest(driver, testIp);
    }
    catch(e){
        console.log(e);
    }
    finally{
        await driver.quit();
    }

    console.log("tests finished");
}


Promise.resolve(runTests());