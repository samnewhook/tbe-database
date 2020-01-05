const express = require("express");
const multer = require("multer");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');

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

router.post("", 
checkAuth,
multer({storage: storage}).single("image"), (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const item = new Item({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
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

router.put("/:id",
checkAuth,
multer({storage: storage}).single("image"), (req, res, next) => {
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
        if (result.nModified > 0){
            res.status(200).json({message: "Update Successful!"});
        } else {
            res.status(401).json({message: "Not Authorized."});
        }
    });
});

router.get("", (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const itemQuery = Item.find();
    let fetchedItems;
    if (pageSize && currentPage) {
        itemQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    itemQuery.then(documents => {
        fetchedItems = documents;
        return Item.count();
    }).then(count => {
        res.status(200).json({
            message: "Items fetched successfully!",
            items: fetchedItems,
            maxItems: count
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

router.delete("/:id", 
checkAuth,
(req, res, next) => {
    Item.deleteOne({_id: req.params.id}).then(
        result => {
            if (result.n > 0){
                res.status(200).json({message: "Item Deleted!"});
            } else {
                res.status(401).json({message: "Not Authorized."});
            }           
        }
    );
});

module.exports = router;