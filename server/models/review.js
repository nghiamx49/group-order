const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReviewSchema = new Schema(
  {
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "Users"},
    itemId: {type: mongoose.Schema.Types.ObjectId, ref: "Items"},
    comment: { type: String, required: true },
    rating: { type: Number, default: 0, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Reviews', ReviewSchema)