const express = require("express");
const orderItemRouter = express.Router();
const db = require("../services/service");
const userRole = require("../middleware/userRole");
const { User, Order, OrderItem, Item } = db;
const passport = require("passport");

orderItemRouter.use(passport.authenticate("jwt", { session: false }));

orderItemRouter.get("/", async (req, res, next) => {
  try {
    const { _id } = req.user;
    let allOrderItem = await OrderItem.find({ userId: _id, isPaid: false });
    if (!allOrderItem) {
      res
        .status(404)
        .json({ message: { mesBody: "No OrderItem Found" }, mesError: true });
      next(error);
    }
    const orderItems = await Promise.all(
      allOrderItem.map(async (ord) => {
        const { _id, itemId, userId, quantity, price } = ord;
        let item = await Item.findById(ord.itemId);
        // let order = await Order.findById(ord.orderId);
        let user = await User.findById(ord.userId);
        ord = {
          _id,
          itemId,
          userId,
          itemName: item.name,
          username: user.username,
          orderQuantity: quantity,
          orderPrice: price,
          category: item.category,
          itemImage: item.image,
          itemName: item.name,
        };
        return ord;
      })
    );
    res.status(200).json({
      status: 200,
      message: { orderItems: orderItems },
      mesError: false,
    });
  } catch (err) {
    res.status(500).json({
      message: { mesBody: "Cannot Found OrderItems" },
      mesError: true,
    });
    next(err);
  }
});

orderItemRouter.post("/create", async (req, res, next) => {
  const { itemId, quantity, orderId } = req.body;
  try {
    const findItemId = await Item.findById(itemId);
    let itemExistsInOrderItem = await OrderItem.findOne({
      itemId: itemId,
      userId: req.user._id,
      isPaid: false,
    });
    if (itemExistsInOrderItem !== null) {
      const { _id } = itemExistsInOrderItem;
      let newQuantity =
        parseInt(itemExistsInOrderItem.quantity) + parseInt(quantity);
      let newPrice = newQuantity * findItemId.price;
      let itemOrderInDb = await OrderItem.findByIdAndUpdate(_id, {
        quantity: newQuantity,
        price: newPrice,
        orderId: orderId || null,
      });
      await itemOrderInDb.save();
      res.status(201).json({
        status: 201,
        mesError: false,
        message: {
          _id: itemOrderInDb._id,
          mesBody: "Item Has been Updated in OrderItem!",
        },
      });
    } else {
      const newOrderItem = await new OrderItem({
        itemId: findItemId._id,
        userId: req.user._id,
        quantity: parseInt(quantity),
        price: parseInt(quantity) * findItemId.price,
        orderId: orderId || null,
      });
      await newOrderItem.save();
      res.status(201).json({
        status: 201,
        message: {
          _id: newOrderItem._id,
          mesBody: "Create New OrderItem Successfully",
        },
        mesError: false,
      });
    }
  } catch (error) {
    res.status(500).json({ message: { mesBody: "Error" }, mesError: true });
    next(error);
  }
});

orderItemRouter.post("/decrease/:orderItemId", async (req, res, next) => {
  try {
    const { orderItemId } = req.params;

    const findItem = await OrderItem.findById(orderItemId);
    let oneItemPrice = findItem.price / findItem.quantity;
    findItem.quantity = findItem.quantity - 1;
    findItem.price = findItem.price - oneItemPrice;
    await findItem.save();
    res.status(200).json({
      status: 200,
      message: { mesBody: "Update Item in Order Successfuly" },
      mesError: false,
    });
  } catch (error) {
    console.log(error);
  }
});

orderItemRouter.delete("/delete/:orderItemId", async (req, res, next) => {
  try {
    const { orderItemId } = req.params;
    await OrderItem.findByIdAndDelete(orderItemId);
    res.status(200).json({
      status: 200,
      message: { mesBody: "Remove Item in Order Successfuly" },
      mesError: false,
    });
  } catch (error) {
    res.status(500).json({ message: { mesBody: "Error" }, mesError: true });
    next(error);
  }
});

module.exports = orderItemRouter;
