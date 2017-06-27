'use strict';

let fs = require('fs');
let path = require('path');
let route = require('express').Router();
let mongoose = require('mongoose');
let multiparty = require('multiparty');
let config = require('./config.json');

require('./OrderingSchema.js');

route.post('/ordering', (req, res) => {
    let form = new multiparty.Form();
    
    form.parse(req, function(err, fields, files) {
        if (err) return res.json({error: err.message || err})
        
        let Model = mongoose.model('ordering'),
        item = new Model({
            fio: fields.fio,
            email: fields.email,
            tel: fields.tel,
            address: fields.address,
            id: fields.id,
            img: fields.img,
            title: fields.title,
            price: fields.price,
            quantity: fields.quantity,
            total: fields.total,
            textarea: fields.textarea,
            archive: "Unsorted"
        });
        
        console.log(item);
        
        item.save().then(ordering => {}, e => {
            throw new Error(Object.keys(e.errors).map(key => e.errors[key].message).join(', '));
        }).then(
            i => res.json({message: 'Запись успешно добавлена'}),
            e => res.json({error: e.message})
        );
    });
});

module.exports = route;