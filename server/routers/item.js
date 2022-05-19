const express = require("express");
const itemRouter = express.Router();
const db = require("../services/service");
const userRole = require("../middleware/userRole");
const { Item, Trademark, Review } = db;

itemRouter.get("/", async (req, res, next) => {
  try {
    const { page } = req.query;
    const limit = 20;
    const skip = page ? limit * (page - 1) : 0;
    let count = await Item.estimatedDocumentCount();
    let allItems;
    if (!page) {
      allItems = await Item.find()
        .sort({ createdAt: -1 })
        .skip(limit * 1)
        .limit(limit);
    }
    if (page) {
      allItems = await Item.find()
        .sort({ createdAt: -1 })
        .skip(limit * page)
        .limit(limit);
    }
    if (!allItems) {
      res
        .status(404)
        .json({ message: { mesBody: "No Items Found" }, mesError: true });
      next(error);
    }
    const items = await Promise.all(
      allItems.map(async (it) => {
        const {
          _id,
          name,
          image,
          trademarkId,
          category,
          price,
          rating,
          customerReviews,
          quantity,
          description,
          reviewId,
        } = it;
        let itemTrademark = await Trademark.findById(it.trademarkId);
        let itemReview = await Review.findById(it.reviewId);
        it = {
          _id,
          itemName: name,
          itemImage: image,
          trademarkId,
          trademarkName: itemTrademark.name,
          itemCategory: category,
          itemPrice: price,
          itemRating: rating,
          customerReviewed: customerReviews,
          itemQuantity: quantity,
          itemDescription: description,
          reviewId,
          itemReviewed: itemReview,
        };
        return it;
      })
    );
    res.status(201).json({
      message: { pages: Math.ceil(count / limit), items: items },
      mesError: false,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: { mesBody: "Cannot Found Items" }, mesError: true });
    next(err);
  }
});

itemRouter.get("/find", async (req, res) => {
  const { trademarkName, page } = req.query;
  let limit = 20;
  let skip = page ? limit * (page - 1) : limit * 0;
  let trademark;
  if (trademarkName) {
    trademark = await Trademark.findOne({ name: trademarkName });
  }
  const count = await Item.find({ trademarkId: trademark?._id });
  const findAllItem = await Item.find({ trademarkId: trademark?._id })
    .skip(skip)
    .limit(limit);
  const items = await Promise.all(
    findAllItem.map(async (it) => {
      const {
        _id,
        name,
        image,
        trademarkId,
        category,
        price,
        rating,
        customerReviews,
        quantity,
        description,
        reviewId,
      } = it;
      let itemTrademark = await Trademark.findById(it.trademarkId);
      let itemReview = await Review.findById(it.reviewId);
      it = {
        _id,
        itemName: name,
        itemImage: image,
        trademarkId,
        trademarkName: itemTrademark.name,
        itemCategory: category,
        itemPrice: price,
        itemRating: rating,
        customerReviewed: customerReviews,
        itemQuantity: quantity,
        itemDescription: description,
        reviewId,
        itemReviewed: itemReview,
      };
      return it;
    })
  );

  res.status(200).json({
    message: { pages: Math.ceil(count.length / limit), items: items },
    mesError: false,
  });
});

itemRouter.get("/getProducts", async (req, res) => {
  const { trademarkName, category } = req.query;

  const trademark = await Trademark.findOne({ name: trademarkName });
  const findAllItem = await Item.find({
    trademarkId: trademark._id,
    category: category,
  });
  const items = await Promise.all(
    findAllItem.map(async (it) => {
      const {
        _id,
        name,
        image,
        trademarkId,
        category,
        price,
        rating,
        customerReviews,
        quantity,
        description,
        reviewId,
      } = it;
      let itemTrademark = await Trademark.findById(it.trademarkId);
      let itemReview = await Review.findById(it.reviewId);
      it = {
        _id,
        itemName: name,
        itemImage: image,
        trademarkId,
        trademarkName: itemTrademark.name,
        itemCategory: category,
        itemPrice: price,
        itemRating: rating,
        customerReviewed: customerReviews,
        itemQuantity: quantity,
        itemDescription: description,
        reviewId,
        itemReviewed: itemReview,
      };
      return it;
    })
  );

  res.status(200).json({
    message: { items: items },
    mesError: false,
  });
});

itemRouter.post("/create", async (req, res, next) => {
  const {
    itemName,
    itemTrademarkId,
    itemImage,
    itemCategory,
    itemPrice,
    itemQuantity,
    itemDescription,
  } = req.body;

  if (!itemName)
    return res.status(400).json({
      mesError: true,
      message: { mesBody: "Please Input Item Name!" },
    });
  if (!itemCategory)
    return res.status(400).json({
      mesError: true,
      message: { mesBody: "Please Input Item Category!" },
    });
  if (!itemPrice)
    return res.status(400).json({
      mesError: true,
      message: { mesBody: "Please Input Item Price!" },
    });
  if (!itemQuantity)
    return res.status(400).json({
      mesError: true,
      message: { mesBody: "Please Input Item Quantity!" },
    });

  try {
    const item = await Item.findOne({ name: itemName });
    if (item)
      return res.status(400).json({
        status: 400,
        mesError: true,
        message: { mesBody: "Item already exists!" },
      });

    const tradeId = await Trademark.findOne({ name: itemTrademarkId });

    //const findItem = await Item.findOne({trademarkId: tradeId._id})

    const newItem = await new Item({
      name: itemName,
      image: itemImage,
      trademarkId: tradeId._id,
      category: itemCategory,
      price: itemPrice,
      quantity: itemQuantity,
      description: itemDescription,
    });
    await newItem.save();
    res.status(201).json({
      status: 201,
      message: { mesBody: "Create New Item Successfully" },
      mesError: false,
    });
  } catch (error) {
    res.status(500).json({ message: { mesBody: "Error" }, mesError: true });
    next(error);
  }
});

itemRouter.param("itemId", async (req, res, next, itemId) => {
  try {
    let findItem = await Item.findById(itemId);
    if (!findItem) {
      res
        .status(404)
        .json({ message: { mesBody: "Item not found" }, mesError: true });
    }
    const {
      _id,
      name,
      image,
      trademarkId,
      category,
      price,
      rating,
      quantity,
      description,
    } = findItem;
    const reviews = await Review.find({ itemId });
    //let itemTrademark = await Trademark.findById(trademarkId)
    req.item = {
      _id,
      itemName: name,
      itemImage: image,
      itemCategory: category,
      itemPrice: price,
      itemRating: rating,
      itemQuantity: quantity,
      itemDescription: description,
      trademarkId,
      reviews: reviews,
      //trademarkName: itemTrademark.name || "",
    };
    next();
  } catch (error) {
    res.status(500).json({ message: { mesBody: "Errors" }, mesError: true });
    next(error);
  }
});

itemRouter.put("/edit/:itemId", async (req, res, next) => {
  const {
    itemName,
    itemTrademarkId,
    itemImage,
    itemCategory,
    itemPrice,
    itemQuantity,
    itemDescription,
  } = req.body;

  if (!itemName)
    return res.status(400).json({
      mesError: true,
      message: { mesBody: "Please Input Item Name!" },
    });
  if (!itemCategory)
    return res.status(400).json({
      mesError: true,
      message: { mesBody: "Please Input Item Category!" },
    });
  if (!itemPrice)
    return res.status(400).json({
      mesError: true,
      message: { mesBody: "Please Input Item Price!" },
    });
  if (!itemQuantity)
    return res.status(400).json({
      mesError: true,
      message: { mesBody: "Please Input Item Quantity!" },
    });

  try {
    const item = await Item.findOne({ name: itemName });
    if (item) {
      return res
        .status(400)
        .json({ mesError: true, message: { mesBody: "Item already exists!" } });
    } else {
      const tradeId = await Trademark.find({ name: itemTrademarkId });
      const { _id } = req.item;
      let itemInDb = await Item.findByIdAndUpdate(_id, {
        name: itemName,
        trademarkId: tradeId._id,
        image: itemImage,
        category: itemCategory,
        price: itemPrice,
        quantity: itemQuantity,
        description: itemDescription,
      });
      await itemInDb.save();
      res.status(201).json({
        mesError: false,
        message: { mesBody: "Item Has been Updated!" },
      });
    }
  } catch (error) {
    res.status(500).json({ message: { mesBody: "Errors" }, mesError: true });
    next(error);
  }
});

itemRouter.get("/details/:itemId", async (req, res, next) => {
  res.status(201).json({ mesError: false, message: { item: req.item } });
});

itemRouter.delete("/delete/:itemId", async (req, res, next) => {
  try {
    const { _id } = req.item;
    await Item.findByIdAndDelete(_id);
    res.status(201).json({
      mesError: false,
      message: { mesBody: "Item Has been Deleted!" },
    });
  } catch (error) {
    res.status(500).json({ message: { mesBody: "Errors" }, mesError: true });
    next(error);
  }
});

module.exports = itemRouter;
