const Item = require("../models/item")


exports.createItem = (req, res, next) => {
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
    })
    .catch(error => {
        res.status(500).json({
            message: "Creating a post failed!"
        })
    });
};

exports.updateItem = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + '/images/' + req.file.filename;
    }
    const item = new Item({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    Item.updateOne({_id: req.params.id}, item).then(result => {
        if (result.n > 0){
            res.status(200).json({message: "Update Successful!"});
        } else {
            res.status(401).json({message: "Not Authorized."});
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "Couldn't update post!"
        });
    });
};

exports.getItems = (req, res, next) => {
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
    })
    .catch(error => {
        res.status.json({message: "Fetching items failed!"});
    });
};

exports.getItemById = (req, res, next) => {
    Item.findById(req.params.id).then( item => {
        if (item) {
            res.status(200).json(item);
        } else {
            res.status(404).json({message: 'Item not found!'});
        }
    }).catch(error => {
        res.status.json({message: "Fetching items failed!"});
    });
};

exports.deleteItemById = (req, res, next) => {
    Item.deleteOne({_id: req.params.id}).then(
        result => {
            if (result.n > 0){
                res.status(200).json({message: "Item Deleted!"});
            } else {
                res.status(401).json({message: "Not Authorized."});
            }      
        }
    ).catch(error => {
        res.status.json({message: "Fetching items failed!"});
    });
};