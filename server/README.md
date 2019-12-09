## General setup
* Boot an opertaiv system (Mac or Linux)
* install node
* npm install --global mocha
* npm install express --save
* npm install --save-dev nyc

## === MONGO ===
* npm install mongodb --save  

* wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -

* echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list

* sudo apt-get update 

* sudo apt-get install -y mongodb-org

* sudo service mongod start

* sudo service mongod restart

* shell commando =>  mongo

## === TESTING ===
* sudo npm install itanbul -g
* sudo npm install -g  nyc
* `nyc mocha --timeout=3000 test_mongo.js`

### Kör det här
`nyc mocha --timeout=3000 ./test/test_app.js --exit`

### För att få lite order i testerna 
`https://github.com/rprieto/mocha-steps`

### Med steps blir det
`nyc mocha --require mocha-steps --timeout=3000 ./test/test_app.js --exit`

om du får en empty tabell, installera mocha lokalt
och kör den lokala

### To run the proper config
* run `node app.js -debug` to run the localhost setup
* run `node app.js -prod`  to run the ip configuration, make sure to change to your ip
* run `make unit` to run server unit tests
* run `make selenium` to run the selenium server. it is just a `node app.js -test` which wipes the database.

#### === Extra === 
```
const options = {
    method: 'post',
    headers: new Headers({'content-type': 'application/json'}),
    mode: 'no-cors',
    body: {_id: id} 
};
options.body = JSON.stringify(options.body);
```