const express = require("express");
const multer = require("multer");
const itemsController = require("../controllers/items")

const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}


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
multer({storage: storage}).single("image"),
itemsController.createItem
);

router.put("/:id",
checkAuth,
multer({storage: storage}).single("image"), 
itemsController.updateItem);

router.get("", 
itemsController.getItems);

router.get("/:id", 
itemsController.getItemById);

router.delete("/:id", 
checkAuth,
itemsController.deleteItemById);

module.exports = router;