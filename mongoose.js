'use strict';

let mongoose = require('mongoose');
let config = require('./config.json');
let options = {
    user: config.db.user,
    pass: config.db.password
};
let host = config.db.host;
let port = config.db.port;
let db = config.db.name;

//console.log(config.db.host, config.db.port, config.db.name);
//console.log(mongoose.version);
//`mongodb://${host}:${port}/${db}`

mongoose.Promise = global.Promise;
//mongoose.disconnect();
mongoose.connect('mongodb://lak:qwe@ds064299.mlab.com:64299/lak', options).catch(e => {
        console.error(e);
        throw e;
    });

module.exports = mongoose;
