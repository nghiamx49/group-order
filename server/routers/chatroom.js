const express = require("express");
const chatroomRouter = express.Router();
const db = require("../services/service");
const { Chatroom, Message } = db;
const passport = require('passport')

chatroomRouter.get("/:id",passport.authenticate('jwt', {session: false}), async (req, res) => {
    const chatroom = await Chatroom.findOne({
        _id: req.params.id,
    }).populate([{ path: 'users' },
    {path: 'messages', populate: {path: 'sender'}}
]);
    if (chatroom) {
        res.status(200).json({
            data: chatroom
        })
    }
})

chatroomRouter.post("/message", async (req, res) =>{
    const {content, senderId, chatroomId} = req.body;
    const newMessage = new Message ({
        content : content,
        sender: senderId,
    })
    await newMessage.save();

    const chatroom = await Chatroom.findById(chatroomId);
    const updateMessage = [...chatroom.messages, newMessage]
    chatroom.messages = updateMessage
    await chatroom.save();
    res.status(201).json({
        data: newMessage
    })
})


module.exports = chatroomRouter;