'use strict';

let mongoose = require('mongoose'),
    ProductSchema = new mongoose.Schema({
        category: {
            type: String,
            required: [true, 'Укажите категорию товара']
        },
        name: {
            type: String,
            required: [true, 'Укажите название товара']
        },
        price: {
            type: String,
            required: [true, 'Укажите цену товара']
        },
        data: {
            type: [String],
            required: [true, 'Укажите дополнительные данные']
        },
        dataPos: {
            type: [String],
            required: [true, 'Укажите дополнительные данные']
        },
        pictures: {
            type: [String]
        }
    });

mongoose.model('product', ProductSchema);