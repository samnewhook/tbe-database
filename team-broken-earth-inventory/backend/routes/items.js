const express = require("express");

const router = express.Router();

const Item = require("../models/item");

router.post("", (req, res, next) => {
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

router.put("/:id", (req, res, next) => {
    const item = new Item({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });
    Item.updateOne({_id: req.params.id}, item).then(result => {
        console.log(result);
        res.status(200).json({message: "Update Successful!"});
    });
});

router.get("", (req, res, next) => {
    Item.find()
    .then(documents => {
    res.status(200).json({
        message: 'Items retrieved successfully.',
        items: documents
    });
    });
});

router.get("/:id", (req, res, next) => {
    Item.findById(req.params.id).then( item => {
        if (item) {
            res.status(200).json(item);
        } else {
            res.status(404).json({message: 'Item not found!'});
        }
    })
});

router.delete("/:id", (req, res, next) => {
    Item.deleteOne({_id: req.params.id}).then(
        result => {
            console.log(result);
            res.status(200).json({message: 'Post Deleted!'});
        }
    );
});

module.exports = router;