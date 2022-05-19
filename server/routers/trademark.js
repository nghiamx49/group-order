const express = require("express");
const tradeRouter = express.Router({ mergeParams: true });
const db = require("../services/service");
const userRole = require("../middleware/userRole");
const { Trademark } = db;

//Get All
tradeRouter.get("/", async (req, res, next) => {
  try {
    let allTrademarks = await Trademark.find({});
    if (!allTrademarks) {
      res
        .status(404)
        .json({ message: { mesBody: "No trademark found" }, mesError: true });
      next(error);
    }
    //using promise all to resolve all promise that the array.prototype.map function retrun
    const trademarks = await Promise.all(
      allTrademarks.map(async (trade) => {
        const { _id, name, description, image } = trade;
        trade = {
          _id,
          trademarkName: name,
          image: image,
          description: description,
        };
        return trade;
      })
    );
    res
      .status(200)
      .json({ message: { trademarks: trademarks }, mesError: false });
  } catch (error) {
    res.status(500).json({ message: { mesBody: "Error" }, mesError: true });
    next(error);
  }
});

//Create New Trademark
tradeRouter.post("/create", async (req, res, next) => {
  const { name, description, image } = req.body;

  if (!name || !description)
    return res
      .status(400)
      .json({
        mesError: true,
        message: { mesBody: "Missing Name or Description!" },
      });

  try {
    const trademark = await Trademark.findOne({ name });
    if (trademark)
      return res
        .status(400)
        .json({
          mesError: true,
          message: { mesBody: "Trademark already exists!" },
        });
    const newTrademark = await new Trademark({
      name,
      description,
      image,
    });
    await newTrademark.save();
    res.status(200).json({
      message: { mesBody: "Create new Trademark successfully" },
      mesError: false,
    });
  } catch (error) {
    res.status(500).json({ message: { mesBody: "Error" }, mesError: true });
    next(error);
  }
});

tradeRouter.param("trademarkId", async (req, res, next, trademarkId) => {
  try {
    let trademark = await Trademark.findById(trademarkId);
    if (!trademark) {
      res
        .status(400)
        .json({ message: { mesBody: "Trademark not found" }, mesError: true });
    }
    const { _id, name, description } = trademark;
    req.trademark = {
      _id,
      name,
      description,
      image,
    };
    next();
  } catch (error) {
    res.status(500).json({ message: { mesBody: "Errors" }, mesError: true });
    next(error);
  }
});

//Details
tradeRouter.get("/details/:trademarkId", async (req, res, next) => {
  res
    .status(200)
    .json({ message: { trademark: req.trademark }, mesError: false });
});

//Update
tradeRouter.put("/edit/:trademarkId", async (req, res, next) => {
  const { name, description, image } = req.body;

  if (!name || !description)
    return res
      .status(400)
      .json({
        mesError: true,
        message: { mesBody: "Missing Name or Description!" },
      });

  try {
    const trademark = await Trademark.findOne({ name });
    if (trademark)
      return res
        .status(400)
        .json({
          mesError: true,
          message: { mesBody: "Trademark Already Exists!" },
        });

    const { _id } = req.trademark;
    let trade = await Trademark.findById(_id);
    trade.name = name;
    trade.image = image;
    trade.description = description;

    await trade.save();
    res.status(200).json({
      message: { mesBody: "Update Trademark Successfully" },
      mesError: false,
    });
  } catch (error) {
    res.status(500).json({ message: { mesBody: "Error" }, mesError: true });
    next(error);
  }
});

//Remove
tradeRouter.delete("/delete/:trademarkId", async (req, res, next) => {
  try {
    const { _id } = req.trademark;
    //let allTrademarks = await Trademark.find({trademarkId: _id})
    await Trademark.deleteOne({ _id });
    res.status(200).json({
      message: { mesBody: "Delete Trademark Successfully" },
      mesError: false,
    });
  } catch (error) {
    res.status(500).json({ message: { mesBody: "Error" }, mesError: true });
    next(error);
  }
});

module.exports = tradeRouter;
