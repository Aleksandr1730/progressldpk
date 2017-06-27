'use strict';

let mongoose = require('mongoose'),
    WorkSchema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, 'Укажите имя проекта']
        },
        brand: {
            type: String,
            required: [true, 'Укажите бренд']
        },
        type: {
            type: String,
            required: [true, 'Укажите тип']
        },
        price: {
            type: String,
            required: [true, 'Укажите цену']
        },
        link: {
            type: String,
            required: [true, 'Укажите ссылку на проект']
        },
        pictures: {
            type: [String]
        }
    });

mongoose.model('work', WorkSchema);