'use strict';

let fs = require('fs');
let path = require('path');
let route = require('express').Router();
let mongoose = require('mongoose');
let multiparty = require('multiparty');
let config = require('./config.json');

require('./WorkSchema.js');

route.post('/works', (req, res) => {
    let form = new multiparty.Form();
    
    form.parse(req, function(err, fields, files) {
        if (err) {
            return res.json({error: err.message || err})
        }
        
        let Model = mongoose.model('work'),
        item = new Model({
            name: fields.workName,
            brand: fields.workBrand,
            type: fields.workType,
            price: fields.workPrice,
            link: "0"
        });
        
        item.save().then(work => {
            let pictures = files.workPicture.filter(f => f.size).map((file, key) => {
                let newFilePath = path.join('upload', `${work._id}_${key}${path.extname(file.path)}`);
                
                fs.writeFileSync(path.resolve(config.http.publicRoot, newFilePath), fs.readFileSync(file.path));
                
                return newFilePath
            });
            
            return Model.update({_id: work._id}, {$pushAll: {pictures: pictures}});
        }, e => {
            throw new Error(Object.keys(e.errors).map(key => e.errors[key].message).join(', '));
        }).then(
            i => res.json({message: 'Запись успешно добавлена'}),
            e => res.json({error: e.message})
        );
    });
});

module.exports = route;