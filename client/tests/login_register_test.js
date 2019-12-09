const {Builder, By, Key, until} = require('selenium-webdriver');
const assert = require('assert');

const isServerOn = false;

async function testLogin(driver){

  const wrongEmailInput = "username";
  const correctEmailInput = "test@gmail.com";
  const tooLongPassword = "a".repeat(140);

  await driver.findElement(By.id('email')).sendKeys(wrongEmailInput, Key.RETURN);
  let warning = await driver.findElement(By.id('warning')).getAttribute('innerHTML');
  assert.equal(warning, "Warning: Wrong email type");

  await driver.findElement(By.id('email')).clear();
  await driver.findElement(By.id('email')).sendKeys(correctEmailInput, Key.RETURN);
  warning = await driver.findElement(By.id('warning')).getAttribute('innerHTML');
  assert.equal(warning, "Warning: Too short password");

  await driver.findElement(By.id('password')).sendKeys(tooLongPassword, Key.RETURN);
  warning = await driver.findElement(By.id('warning')).getAttribute('innerHTML');
  assert.equal(warning, "Warning: Too long password");
} 

async function testRegister(driver){
  const tooShortUsername = "abc";
  const tooLongUsername = "a".repeat(21);

  const wrongEmailInput = "test";

  const tooLongPassword = "b".repeat(129);

  const correctUsername = "testuser";
  const correctEmail = "test@gmail.com";
  const correctPassword = "password";

  await driver.findElement(By.id('username')).sendKeys(tooShortUsername, Key.RETURN);
  let warning = await driver.findElement(By.id('warning')).getAttribute('innerHTML');
  assert.equal(warning, "Warning: Too short username");

  await driver.findElement(By.id('username')).sendKeys(tooLongUsername, Key.RETURN);
  warning = await driver.findElement(By.id('warning')).getAttribute('innerHTML');
  assert.equal(warning, "Warning: Too long username");

  await driver.findElement(By.id('username')).clear();

  await driver.findElement(By.id('username')).sendKeys(correctUsername, Key.RETURN);
  warning = await driver.findElement(By.id('warning')).getAttribute('innerHTML');
  assert.equal(warning, "Warning: Wrong email type");

  await driver.findElement(By.id('email')).sendKeys(wrongEmailInput, Key.RETURN);
  warning = await driver.findElement(By.id('warning')).getAttribute('innerHTML');
  assert.equal(warning, "Warning: Wrong email type");

  await driver.findElement(By.id('email')).clear();


  await driver.findElement(By.id('email')).sendKeys(correctEmail, Key.RETURN);
  warning = await driver.findElement(By.id('warning')).getAttribute('innerHTML');
  assert.equal(warning, "Warning: Too short password");


  await driver.findElement(By.id('password')).sendKeys(tooLongPassword, Key.RETURN);
  warning = await driver.findElement(By.id('warning')).getAttribute('innerHTML');
  assert.equal(warning, "Warning: Too long password");


  await driver.findElement(By.id('password')).clear();
  await driver.findElement(By.id('password')).sendKeys(correctPassword, Key.RETURN);
  warning = await driver.findElement(By.id('warning')).getAttribute('innerHTML');
  assert.equal(warning, "Warning: The passwords are not the same!!!!");

  await driver.findElement(By.id('rePassword')).sendKeys(correctPassword, Key.RETURN);
  const currentUrl = await driver.getCurrentUrl();

  if(isServerOn){
    console.log(currentUrl);
  assert.equal(currentUrl.endsWith("login"), true);
  }
}


async function start(driver, testIp) {

  try {
    await driver.get(testIp + '/login');
    await testLogin(driver);
    await driver.get(testIp + '/register');
    await testRegister(driver);
  }

  catch(e) {
    console.log("ERROR: ===>");
    console.log(e);
  }
}

module.exports = start;