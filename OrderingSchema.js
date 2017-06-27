'use strict';

let mongoose = require('mongoose'),
    OrderingSchema = new mongoose.Schema({
        fio: {
            type: String,
            required: [true, 'Укажите ФИО']
        },
        email: {
            type: String,
            required: [true, 'Укажите email']
        },
        tel: {
            type: String,
            required: [true, 'Укажите телефон']
        },
        address: {
            type: String,
            required: [true, 'Укажите адрес']
        },
        id: {
            type: [String]
        },
        img: {
            type: [String]
        },
        title: {
            type: [String]
        },
        price: {
            type: [String]
        },
        quantity: {
            type: [String]
        },
        total: {
            type: [String]
        },
        textarea: {
            type: String
        },
        archive: {
            type: String
        }
    });

mongoose.model('ordering', OrderingSchema);