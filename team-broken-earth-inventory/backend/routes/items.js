const express = require("express");
const multer = require("multer");

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const Item = require("../models/item");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("invalid mime type");
        if (isValid) {
            error = null;
        }
        cb(null, "backend/images")
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

router.post("", multer({storage: storage}).single("image"), (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const item = new Item({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename
    });
    item.save().then(createdItem => {
        res.status(201).json({
            message: 'Item Added Successfully!',
            item: {
                ...createdItem,
                id: createdItem._id
            }
        });
    });
});

router.put("/:id", multer({storage: storage}).single("image"), (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + '/images/' + req.file.filename;
    }
    const item = new Item({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
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