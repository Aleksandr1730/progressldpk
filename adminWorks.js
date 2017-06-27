'use strict';

let fs = require('fs');
let path = require('path');
let route = require('express').Router();
let mongoose = require('mongoose');
let multiparty = require('multiparty');
let config = require('./config.json');

require('./WorkSchema.js');

route.post('/change', (req, res) => {
    let form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        if (err) return res.json({error: err.message || err});
        
        let Model = mongoose.model('work');
        
        Model.findByIdAndUpdate(fields.id[0], {name: fields.title[0], brand: fields.brand[0], type: fields.type[0], price: fields.price[0]}, {new: true}, function(err, user){
            if(err) return console.log(err);
            if(!err) res.json({message: 'Запись успешно обновлена'});
            console.log("Обновленный объект", user);
        });
        
    });
});

route.post('/delete', (req, res) => {
    let form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        if (err) return res.json({error: err.message || err})
        
        let Model = mongoose.model('work');
        
        Model.findByIdAndRemove(fields.id[0], function(err, doc){
            if(err) return console.log(err);
            if(!err) res.json({message: 'Запись успешно удалена'});
            console.log("Удален объект", doc);
        });
        
    });
});

module.exports = route;