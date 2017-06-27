'use strict';

let mongoose = require('mongoose'),
    SectionSchema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, 'Укажите название раздела']
        },
        category: {
            type: String,
            required: [true, 'Укажите название категории']
        },
        id: {
            type: String,
            required: [true, 'Укажите идентификатор']
        },
        data: {
            type: [String],
            required: [true, 'Укажите дополнительные данные']
        },
        pictures: {
            type: [String]
        }
    });

mongoose.model('section', SectionSchema);