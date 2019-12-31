const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Item = require('./models/item');

const app = express();

mongoose.connect('mongodb+srv://sam:YWHGxUbIkzqseUFX@tbe-inventory-def3a.mongodb.net/tbe-inventory?retryWrites=true&w=majority')
.then(() => {
    console.log('connection is working')
})
.catch(() => {
    console.log('connection failed')
});

app.use(bodyParser.json());


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept"
        );
    res.setHeader(
        "Access-Control-Allow-Methods", 
        "GET, POST, PATCH, DELETE, OPTIONS"
        );
    next();
});

app.post("/items", (req, res, next) => {
    const item = new Item({
        title: req.body.title,
        content: req.body.content
    });
    item.save().then(createdItem => {
        res.status(201).json({
            message: 'Item Added Successfully!',
            itemId: createdItem._id
        });
    });
});

app.get('/items', (req, res, next) => {
    Item.find()
    .then(documents => {
    res.status(200).json({
        message: 'Items retrieved successfully.',
        items: documents
    });
    });
});

app.delete('/items/:id', (req, res, next) => {
    Item.deleteOne({_id: req.params.id}).then(
        result => {
            console.log(result);
            res.status(200).json({message: 'Post Deleted!'});
        }
    );
});

module.exports = app;