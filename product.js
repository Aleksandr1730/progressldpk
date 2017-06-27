'use strict';

let fs = require('fs');
let path = require('path');
let route = require('express').Router();
let mongoose = require('mongoose');
let multiparty = require('multiparty');
let config = require('./config.json');

require('./ProductSchema.js');

route.post('/product', (req, res) => {
    let form = new multiparty.Form();
    
    form.parse(req, function(err, fields, files) {
        if (err) {
            return res.json({error: err.message || err})
        }
        
        Array.prototype.clean = function(deleteValue){
            for (var i = 0; i < this.length; i++)
            {
                if (this[i] == deleteValue)
                {         
                    this.splice(i, 1);
                    i--;
                }
            }
            return this;
        };
        
        fields.dataText.clean('');
        
        let Model = mongoose.model('product'),
        item = new Model({
            category: fields.select,
            name: fields.productName,
            price: fields.productPrice,
            data: fields.dataText,
            dataPos: fields.dataTextPos
        });
        
        item.save().then(product => {
            let pictures = files.productPicture.filter(f => f.size).map((file, key) => {
                let newFilePath = path.join('upload', `${product._id}_${key}${path.extname(file.path)}`);
                
                fs.writeFileSync(path.resolve(config.http.publicRoot, newFilePath), fs.readFileSync(file.path));
                
                return newFilePath
            });
            
            return Model.update({_id: product._id}, {$pushAll: {pictures: pictures}});
        }, e => {
            throw new Error(Object.keys(e.errors).map(key => e.errors[key].message).join(', '));
        }).then(
            i => res.json({message: 'Запись успешно добавлена'}),
            e => res.json({error: e.message})
        );
    });
});

module.exports = route;