const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TrademarkSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    description: { type: String, required: false },
  },
  {
    timestamps: true,
  })

module.exports = mongoose.model('Trademarks', TrademarkSchema)