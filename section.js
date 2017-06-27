'use strict';

let fs = require('fs');
let path = require('path');
let route = require('express').Router();
let mongoose = require('mongoose');
let multiparty = require('multiparty');
let config = require('./config.json');

require('./SectionSchema.js');

route.post('/section', (req, res) => {
    let form = new multiparty.Form();
    
    form.parse(req, function(err, fields, files) {
        if (err) {
            return res.json({error: err.message || err})
        }
        
        let Model = mongoose.model('section'),
        item = new Model({
            name: fields.sectionName,
            category: fields.sectionCategory,
            id: "?section=" + fields.sectionName + "&" + "category=" + fields.sectionCategory,
            data: fields.name
        });
        
        item.save().then(section => {
            let pictures = files.sectionPicture.filter(f => f.size).map((file, key) => {
                let newFilePath = path.join('upload', `${section._id}_${key}${path.extname(file.path)}`);
                
                fs.writeFileSync(path.resolve(config.http.publicRoot, newFilePath), fs.readFileSync(file.path));
                
                return newFilePath
            });
            
            return Model.update({_id: section._id}, {$pushAll: {pictures: pictures}});
        }, e => {
            throw new Error(Object.keys(e.errors).map(key => e.errors[key].message).join(', '));
        }).then(
            i => res.json({message: 'Запись успешно добавлена'}),
            e => res.json({error: e.message})
        );
    });
});

module.exports = route;