const express = require("express");
const itemsController = require("../controllers/items")

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/check-mime-type');

router.post("", 
checkAuth,
extractFile,
itemsController.createItem
);

router.put("/:id",
checkAuth,
extractFile, 
itemsController.updateItem);

router.get("", 
itemsController.getItems);

router.get("/:id", 
itemsController.getItemById);

router.delete("/:id", 
checkAuth,
itemsController.deleteItemById);

module.exports = router;