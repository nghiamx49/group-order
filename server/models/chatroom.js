const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ChatroomSchema = new Schema(
  {
    messages: [{type: mongoose.Schema.Types.ObjectId, ref: "Messages" }],
    users: [{type: mongoose.Schema.Types.ObjectId, ref: "Users" }]
  },
  {
    timestamps: true,
  })

module.exports = mongoose.model('Chatrooms', ChatroomSchema)