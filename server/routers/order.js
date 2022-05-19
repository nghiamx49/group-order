const express = require("express");
const orderRouter = express.Router();
const db = require("../services/service");
const userRole = require("../middleware/userRole");
const { User, Order, Payment, OrderItem, Item, Chatroom, Message } = db;
const passport = require("passport");

orderRouter.use(passport.authenticate("jwt", { session: false }));

orderRouter.get("/", async (req, res, next) => {
  try {
    let allOrder = await Order.find({});
    if (!allOrder) {
      res
        .status(404)
        .json({ message: { mesBody: "No Order Found" }, mesError: true });
      next(error);
    }
    const orders = await Promise.all(
      allOrder.map(async (or) => {
        const {
          _id,
          ownerId,
          addressId,
          isTeamOrder,
          isOrderLocker,
          status,
          orderItemId,
          paymentId,
          deliveryPrice,
          isPaid,
          paidAt,
          isDelivered,
          deliveredAt,
        } = or;

        let userOrder = await User.findById(or.ownerId);
        let addressOrder = await Address.findById(or.addressId);
        let paymentOrder = await Payment.findById(or.paymentId);
        let orderItem = await OrderItem.findById(or.orderItemId);

        or = {
          _id,
          userFullName: userOrder.fullname,
          ownerId,
          // addressId,
          orderItemId,
          //userAddress: addressOrder.address,
          //paymentId,
          //paymentName: paymentOrder.name,
          teamOrder: isTeamOrder,
          orderLocked: isOrderLocker,
          statusOrder: status,
          delivertyFee: deliveryPrice,
          paid: isPaid,
          datePaid: paidAt,
          delivered: isDelivered,
          dateDelivered: deliveredAt,
        };
        return or;
      })
    );

    res.status(201).json({ message: { orders: orders }, mesError: false });
  } catch (err) {
    res
      .status(500)
      .json({ message: { mesBody: "Cannot Found Item" }, mesError: true });
    next(err);
  }
});

orderRouter.get("/leave", async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id);
  user.currentGroupOrderId = null;
  user.currentChatroomId = null;
  const chatRoom = await Chatroom.findOne({users: _id}, null, {populate: {path: 'users'}})
  const updatedMember = chatRoom.users.filter(user => user._id.toString() !== _id.toString());
  chatRoom.users = updatedMember;
  await chatRoom.save();
  await user.save();
  const allItem = await OrderItem.find({ userId: _id, isPaid: false });
  await Promise.all(
    allItem.map(async (item) => {
      item.orderId = null;
      await item.save();
    })
  );
  res.status(200).json({
    status: 200,
    data: {
      groupId: "",
      currentUserId: _id,
      isOwner: false,
      data: [],
      isOrderLocker: false,
    },
  });
});

orderRouter.get("/group", async (req, res) => {
  const { _id, currentGroupOrderId } = req.user;
  const user = await User.findById(_id);
  const findOrderGroupOwned = await Order.findOne({ ownerId: _id });
  if (findOrderGroupOwned) {
    res.status(200).json({
      data: {
        groupId: findOrderGroupOwned._id,
        isOwner: true,
        currentUserId: _id,
        isOrderLocker: findOrderGroupOwned.isOrderLocker,
      },
    });
  } else {
    res.status(200).json({
      data: {
        groupId: user.currentGroupOrderId || "",
        currentUserId: _id,
        isOwner: false,
        isOrderLocker: false,
        currentChatroomId: user.currentChatroomId || "",
      },
    });
  }
});

orderRouter.get("/joinedgroup", async (req, res) => {
  const { _id } = req.user;
  const findUser = await User.findById(_id);
  res.status(200).json({
    status: 200,
    data: {
      currentUserId: _id,
      groupId: findUser.currentGroupOrderId || "",
      isOwner: false,
      isOrderLocker: false,
      chatroomId: findUser.currentChatroomId || "",
    },
  });
});

orderRouter.post("/join", async (req, res) => {
  const { groupId , chatroomId} = req.body;
  await User.findByIdAndUpdate(req.user._id, {
    currentGroupOrderId: groupId,
    currentChatroomId: chatroomId
  });
  const chatroomIsActive = await Chatroom.findById(chatroomId);
  const updateChatUser = [...chatroomIsActive.users, req.user._id];
  chatroomIsActive.users = updateChatUser;
  await chatroomIsActive.save();
  const allUserOrderItem = await OrderItem.find({
    userId: req.user._id,
    isPaid: false,
  });
  await Promise.all(
    allUserOrderItem.map(async (item) => {
      item.orderId = groupId;
      await item.save();
    })
  );
  res.status(200).json({
    status: 200,
    message: {
      mesBody: "join group order success",
    },
  });
});

orderRouter.get("/orderstatus/:orderId/:status", async (req, res) => {
  const { orderId, status } = req.params;
  await Order.findByIdAndUpdate(orderId, {
    isOrderLocker: status,
  });
  res.status(200).json({
    status: 200,
  });
});

orderRouter.delete("/delete/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const {_id} = req.user;
  const findAllUserInThisGroup = await User.find({
    currentGroupOrderId: orderId,
  });
  await Chatroom.findOneAndDelete({users: _id});
  await Promise.all(
    findAllUserInThisGroup.map(async (user) => {
      user.currentGroupOrderId = null;
      user.currentChatroomId = null;
      await user.save();
    })
  );
  const findAllItemInThisGroup = await OrderItem.find({ orderId });
  await Promise.all(
    findAllItemInThisGroup.map(async (item) => {
      item.orderId = null;
      await item.save();
    })
  );
  await Order.findByIdAndDelete(orderId);
  res.status(200).json({
    status: 200,
    data: {
      isOwner: false,
      currentUserId: "",
      groupId: "",
      data: [],
      isOrderLocker: false,
    },
  });
});

orderRouter.post("/create", async (req, res, next) => {
  const { NOTCHECK } = process.env;
  try {
    const userOrder = await Order.findOne({ ownerId: req.user._id });
    if ((userOrder && userOrder?.status !== NOTCHECK) || userOrder === null) {
      const newOrder = await new Order({
        ownerId: req.user._id,
      });
      const newChatroom = new Chatroom({
        users: [req.user._id]
      });
      await newChatroom.save();
      const allItemOfOnwer = await OrderItem.find({
        userId: req.user._id,
        isPaid: false,
      });
      allItemOfOnwer.length !== 0 &&
        (await Promise.all(
          allItemOfOnwer.map(async (item) => {
            item.orderId = newOrder._id;
            await item.save();
          })
        ));
      await newOrder.save();
      res.status(201).json({
        status: 201,
        message: {
          mesBody: "Create New Order Successfully",
          groupId: newOrder._id,
          chatroomId: newChatroom._id,
          isOwner: true,
          isOrderLocker: false,
        },
        mesError: false,
      });
    } else {
      res.status(400).json({
        message: { mesBody: "Your already have one group" },
        mesError: false,
      });
    }
  } catch (error) {
    res.status(500).json({ message: { mesBody: "Error" }, mesError: true });
    next(error);
  }
});



orderRouter.get("/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const allItemInThisGroup = await OrderItem.find({ orderId, isPaid: false });

  const getAllUserId = allItemInThisGroup
    .map((item) => item.userId.toString())
    .filter((v, i, a) => a.indexOf(v) == i);

  const response = await Promise.all(
    getAllUserId.map(async (userId) => {
      const user = await User.findById(userId);
      const allOrderItem = await OrderItem.find({ userId, isPaid: false });
      const data = await Promise.all(
        allOrderItem.map(async (ord) => {
          const { _id, itemId, quantity, price } = ord;
          let item = await Item.findById(ord.itemId);
          // let order = await Order.findById(ord.orderId);
          ord = {
            _id,
            itemId,
            itemName: item.name,
            orderQuantity: quantity,
            orderPrice: price,
            category: item.category,
            itemImage: item.image,
            itemName: item.name,
          };
          return ord;
        })
      );
      return {
        username: user.username,
        fullName: user.fullname,
        currentUserId: user._id,
        data: data,
      };
    })
  );
  res.status(200).json({
    status: 200,
    data: response,
  });
});

module.exports = orderRouter;
