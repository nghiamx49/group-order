const mongoose = require("mongoose");

const db = {};

const user = require("../models/user");
const role = require("../models/role");
const item = require("../models/item");
const trademark = require("../models/trademark");
const review = require("../models/review");
const orderItem = require("../models/order-item");
const payment = require("../models/payment");
const order = require("../models/order");
const chatroom = require("../models/chatroom");
const message = require("../models/message");

mongoose.Promise = global.Promise;

db.mongoose = mongoose;

db.User = user;
db.Role = role;
db.Item = item;
db.Trademark = trademark;
db.Review = review;
db.OrderItem = orderItem;
db.Payment = payment;
db.Order = order;
db.Chatroom = chatroom;
db.Message = message;

db.seeddata = async () => {
  const { items } = require("../data");
  const { Item, Trademark } = db;
  const tradeMarkList = require("../trademarks.json");
  const countItem = await Trademark.estimatedDocumentCount();
  if (countItem === 0) {
    await Promise.all(
      tradeMarkList.map(async (trademark) => {
        const newTrademark = new Trademark({
          ...trademark,
        });
        await newTrademark.save();
      })
    );
  }
};

db.connectToMG = async () => {
  try {
    await mongoose.connect(`${process.env.DEV_URL}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

db.initialize = async () => {
  try {
    const { User, Role } = db;
    let admin, manager, customer;
    let countRole = await Role.estimatedDocumentCount();
    if (countRole === 0) {
      admin = await new Role({
        name: process.env.ADMIN,
      });
      manager = await new Role({
        name: process.env.MANAGER,
      });
      customer = await new Role({
        name: process.env.CUSTOMER,
      });
      await admin.save();
      await manager.save();
      await customer.save();
    }

    let countUser = await User.estimatedDocumentCount();
    let newUser;
    if (countUser === 0) {
      let adminRole = await Role.findOne({ name: process.env.ADMIN });
      newUser = new User({
        username: "admin",
        password: "admin",
        roleId: adminRole._id,
        fullname: "Adminstrator",
        image: "",
      });
      await newUser.save();
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = db;
