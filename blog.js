'use strict';

let route = require('express').Router();
let mongoose = require('mongoose');

require('./BlogSchema.js');

route.post('/blog', (req, res) => {
    let Model = mongoose.model('blog'),
        item = new Model({
            title: req.body.title,
            body: req.body.text,
            date: req.body.date
        });
    
    //console.log(typeof req.body.title);
    //console.log(req.body.title, req.body.date, req.body.text);
    //console.log(item);
    
    item.save().then(
        i => res.json({
            message: 'Запись добавлена!'
        }),
        e => {
            let error = Object.keys(e.errors).map(key => e.errors[key].message).join(', ');

            res.json({
                error: error
            });
        });
});

module.exports = route;