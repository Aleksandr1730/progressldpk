'use strict';

let fs = require('fs');
let path = require('path');
let route = require('express').Router();
let mongoose = require('mongoose');
let multiparty = require('multiparty');
let config = require('./config.json');

require('./OrderingSchema.js');

route.post('/defer', (req, res) => {
    let form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        if (err) return res.json({error: err.message || err})
        
        let Model = mongoose.model('ordering');
        
        Model.findByIdAndUpdate(fields.id[0], {archive: "Defer"}, {new: true}, function(err, user){
            if(err) return console.log(err);
            if(!err) res.json({message: 'Запись успешно обновлена'});
            console.log("Обновленный объект", user);
        });
        
    });
});

route.post('/ready', (req, res) => {
    let form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        if (err) return res.json({error: err.message || err})
        
        let Model = mongoose.model('ordering');
        
        Model.findByIdAndUpdate(fields.id[0], {archive: "Ready"}, {new: true}, function(err, user){
            if(err) return console.log(err);
            if(!err) res.json({message: 'Запись успешно обновлена'});
            console.log("Обновленный объект", user);
        });
        
    });
});

module.exports = route;