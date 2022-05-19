const { Server } = require("socket.io");
const db = require("../services/service");

const { User, Order, Address, Payment, OrderItem, Item, Chatroom, Message } = db;
const findAllItemInGroup = async (groupId) => {
  const allItemInThisGroup = await OrderItem.find({
    orderId: groupId,
    isPaid: false,
  });

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
  return response;
};

const groupOrderRouter = async (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  io.on("connection", (socket) => {
    socket.on('user-online', async (userId) => {
      await User.findByIdAndUpdate(userId, {isOnline: true, socketId: socket.id})
    })

    socket.on('disconnect', async () => {
      await User.findOneAndUpdate({socketId: socket.id}, {isOnline: false})
    })

    socket.on('message-sent', async ({chatroomId, senderId, content}) => {
      const newMessage = new Message ({
          content : content,
          sender: senderId,
      })
      await newMessage.save();
      const chatroom = await Chatroom.findById(chatroomId).populate([{ path: 'users' },
      {path: 'messages', populate: {path: 'sender'}}
      ]);
      const updateMessage = [...chatroom.messages, newMessage]
      chatroom.messages = updateMessage
      await chatroom.save();
      const listMessage = await Chatroom.findById(chatroomId).populate([{ path: 'users' },
      {path: 'messages', populate: {path: 'sender'}}
      ]);
      io.emit('message-received', listMessage.messages)
    })

    socket.on("group-changed", async (groupId) => {
      const data = await findAllItemInGroup(groupId);
      const group = await OrderItem.find({
        orderId: groupId,
        isPaid: false,
      }).populate({path: 'userId'});
      const listUserSocketId = [...new Set(group.filter(item => item.userId.isOnline).map(item => item.userId?.socketId))];
      io.to(listUserSocketId).emit("force-update", data);
    });
    socket.on("group-deleted", () => {
      io.emit("force-user-leave", {
        isOwner: false,
        currentUserId: "",
        groupId: "",
        data: [],
      });
    });
    socket.on("group-locked-toggle", (data) => {
      io.emit("locked", data);
    });
    socket.on("group-paid", () => {
      io.emit("paid");
    });
  });
};

module.exports = groupOrderRouter;
