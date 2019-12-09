module.exports = {
    "test": {
        db: {
            db_name: 'programmers_hub_test',
            hub_collection_name: 'hub_collection_test',
            auth_collection_name: 'auth_collection_test',
            user_collection_name:  'user_collection_test',
            chat_collection_name: 'chat_collection_test',
            url: 'mongodb://localhost:27017',
        }, // TODO: put ip o sånt under server
        ip  : '127.0.0.1',
        port: 4000
    },
    "prod": {
        db: {
            db_name: 'programmers_hub',
            hub_collection_name: 'hub_collection',
            auth_collection_name: 'auth_collection',
            user_collection_name: 'user_collection',
            chat_collection_name: 'chat_collection',
            url: 'mongodb://localhost:27017',
        },
        ip: '10.242.34.255',
        port: 3000
    },

    "debug": {
        db: {
            db_name: 'programmers_hub',
            hub_collection_name: 'hub_collection',
            auth_collection_name: 'auth_collection',
            user_collection_name: 'user_collection',
            chat_collection_name: 'chat_collection',
            url: 'mongodb://localhost:27017',
        },
        ip: '127.0.0.1',
        port: 3000
    }
}