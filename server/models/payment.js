const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentSchema = new Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Orders",
      required: true,
    },
    description: { type: String, required: false },
    status: String,
    email: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payments", PaymentSchema);
