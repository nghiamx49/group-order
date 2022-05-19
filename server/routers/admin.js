const express = require("express");
const adminRouter = express.Router();
const db = require("../services/service");
const userRole = require("../middleware/userRole");
const { Item, Trademark, Review, OrderItem, User, Role } = db;
const uploadExcel = require("../middleware/multer");
const xlsx = require("node-xlsx");
const fs = require("fs");

const migrateToDb = (filename) => {
  const obj = xlsx.parse(__basedir + `/statics/${filename}`);
  const { data } = obj[0];
  const jsonData = [];
  const length = data.length;
  for (let i = 1; i < length - 1; i++) {
    if (data[i][0] === undefined) {
      return jsonData;
    }
    jsonData.push({
      name: data[i][0],
      image: data[i][1],
      quantity: data[i][2],
      price: data[i][3],
      category: data[i][4],
      trademark: data[i][5],
      customerReviews: data[i][6],
      rating: data[i][7],
      description: data[i][8],
    });
  }
  return jsonData;
};

const readData = (filename) => {
  const obj = xlsx.parse(__basedir + `/statics/${filename}`);
  const { data } = obj[0];
  const jsonData = [];
  const length = data.length;
  for (let i = 0; i < length - 1; i++) {
    if (data[i][0] === undefined) {
      return jsonData;
    }
    jsonData.push([
      { value: data[i][0] },
      { value: data[i][1] },
      { value: data[i][2] },
      { value: data[i][3] },
      { value: data[i][4] },
      { value: data[i][5] },
      { value: data[i][6] },
      { value: data[i][7] },
      { value: data[i][8] },
    ]);
  }
  return jsonData;
};

adminRouter.get("/", async (req, res) => {
  const allItem = await OrderItem.find({ isPaid: true });
  const totalSale = allItem.reduce((total, item) => total + item.quantity, 0);
  const totalIncome = allItem.reduce((total, item) => total + item.price, 0);
  const totalOrder = allItem.length;
  const topItem = await OrderItem.find({ isPaid: true })
    .limit(5)
    .sort({ updatedAt: -1 });
  const getAllUserId = allItem
    .map((item) => item.userId.toString())
    .filter((v, i, a) => a.indexOf(v) == i);

  const response = await Promise.all(
    getAllUserId.map(async (userId) => {
      const user = await User.findById(userId);
      const allOrderItem = await OrderItem.find({ userId, isPaid: true });
      const data = allOrderItem.reduce((sum, ord) => {
        const { price } = ord;
        return sum + price;
      }, 0);
      return {
        username: user.fullname,
        order: allOrderItem.length,
        price: data,
      };
    })
  );
  const lastestOrder = await Promise.all(
    topItem.map(async (item) => {
      const { _id, userId, price, updatedAt } = item;
      const user = await User.findById(userId);
      return {
        id: item._id,
        user: user.fullname,
        date: updatedAt.toString().slice(4, 16),
        price: `$${price}`,
        status: "paid",
      };
    })
  );
  const findRole = await Role.findOne({ name: process.env.CUSTOMER });
  const allUser = await User.find({ roleId: findRole._id });
  res.status(200).json({
    statusCards: [
      {
        icon: "bx bx-shopping-bag",
        count: totalSale,
        title: "Total sales",
      },
      {
        icon: "bx bx-user",
        count: allUser.length,
        title: "User in System",
      },
      {
        icon: "bx bx-dollar-circle",
        count: `$${totalIncome}`,
        title: "Total income",
      },
      {
        icon: "bx bx-receipt",
        count: totalOrder,
        title: "Total orders",
      },
    ],
    latestOrders: {
      header: ["order id", "user", "total price", "date", "status"],
      body: lastestOrder,
    },
    topCustomers: {
      head: ["user", "total orders", "total spending"],
      body: response.sort((a, b) => a.price - b.price > 0).slice(0, 5),
    },
  });
});

adminRouter.get("/alluser", async (req, res) => {
  const findRole = await Role.findOne({ name: process.env.CUSTOMER });
  const allUser = await User.find({ roleId: findRole._id });
  const response = await Promise.all(
    allUser.map(async (user) => {
      const { _id, username, fullname, createdAt, image } = user;
      return {
        _id,
        username,
        fullname,
        createdAt: createdAt.toString().slice(4, 16),
        image,
      };
    })
  );
  res.status(200).json({
    allUser: response,
  });
});

adminRouter.get("/allproducts", async (req, res) => {
  try {
    let allItems = await Item.find().sort({ createdAt: -1 });
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
          trademarkName: itemTrademark.name,
          itemCategory: category,
          itemPrice: price,
          itemRating: rating,
          itemQuantity: quantity,
        };
        return it;
      })
    );
    res.status(201).json({ message: { items: items }, mesError: false });
  } catch (e) {
    console.log(e);
  }
});

adminRouter.get("/allorders", async (req, res) => {
  const orderList = await OrderItem.find();
  const orderItems = await Promise.all(
    orderList.map(async (ord) => {
      const { _id, itemId, userId, quantity, price } = ord;
      let item = await Item.findById(ord.itemId);
      // let order = await Order.findById(ord.orderId);
      let user = await User.findById(ord.userId);
      ord = {
        _id,
        itemName: item.name,
        username: user.fullname,
        orderQuantity: quantity,
        orderPrice: price,
        itemImage: item.image,
      };
      return ord;
    })
  );
  res.status(200).json({ message: { items: orderItems } });
});

adminRouter.post(
  "/uploadexcel",
  uploadExcel.single("file"),
  async (req, res) => {
    try {
      const filename = req.file.filename;
      const jsonData = await readData(filename);
      res.status(200).json({ status: 200, data: jsonData, filename: filename });
    } catch (error) {
      console.log(error);
    }
  }
);
adminRouter.get("/confirm/:filename", async (req, res) => {
  try {
    const { filename } = req.params;
    const data = migrateToDb(filename);
    let array = data.map(async (it) => {
      const findItem = await Item.findOne({ name: it.name });
      if (findItem) {
        return;
      }
      const tradeMarkItem = await Trademark.findOne({ name: it.trademark });
      const newItem = new Item({
        name: it.name,
        image: it.image,
        trademarkId: tradeMarkItem._id,
        category: it.category,
        price: it.price,
        rating: it.rating,
        customerReviews: it.customerReviews,
        quantity: it.quantity,
        description: it.description,
      });
      await newItem.save();
    });
    await Promise.all(array);
    res.status(200).json({ status: 200 });
  } catch (error) {
    console.log(error);
  }
});

adminRouter.get("/delete/:filename", async (req, res) => {
  try {
    const { filename } = req.params;
    await fs.unlinkSync(__basedir + `/statics/${filename}`);
    res.status(200).json({ status: 200 });
  } catch (error) {}
});

module.exports = adminRouter;
