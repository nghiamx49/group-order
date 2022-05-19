const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    address: String,
    isTeamOrder: { type: Boolean, default: true },
    isOrderLocker: { type: Boolean, default: false },
    status: { type: String, default: process.env.NOTCHECK },
    deliveryPrice: { type: Number, default: 0 },
    isDelivered: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Orders", OrderSchema);
