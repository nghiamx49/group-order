const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ItemSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    trademarkId: {type: mongoose.Schema.Types.ObjectId, ref: "Trademarks" },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0, required: true },
    customerReviews: { type: Number, default: 0, required: true },
    quantity: { type: Number, required: true },
    description: { type: String, required: false },
    reviewId: [{type: mongoose.Schema.Types.ObjectId, ref: "Reviews"}],
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Items', ItemSchema)