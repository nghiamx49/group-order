const express = require("express");
const paymentRouter = express.Router();
const db = require("../services/service");
const userRole = require("../middleware/userRole");
const nodemailer = require("nodemailer");
const payment = require("../models/payment");
const { User, Order, Address, Payment, OrderItem } = db;
const passport = require("passport");

paymentRouter.use(passport.authenticate("jwt", { session: false }));

paymentRouter.get("/", async (req, res, next) => {
  try {
    let allPayments = await Payment.find({});
    if (!allPayments) {
      res.status(404).json({
        message: { mesBody: "Cannot Found Payments!" },
        mesError: true,
      });
      next(error);
    }

    const payments = await Promise.all(
      allPayments.map(async (pay) => {
        const { _id, orderId, name, id, status, email } = pay;
        let orderPayment = await Order.findById(pay.orderId);
        pay = {
          _id,
          orderId,
          paymentName: name,
          paymentId: id,
          statusPayment: status,
          emailPayment: email,
        };
        return pay;
      })
    );
    res.status(201).json({ message: { payments: payments }, mesError: false });
  } catch (err) {
    res
      .status(500)
      .json({ message: { mesBody: "Cannot Found Payments!" }, mesError: true });
    next(err);
  }
});

paymentRouter.post("/group-checkout/:orderId", async (req, res) => {
  const { orderId, deliveryPrice, address, description, email } = req.body;
  await Order.findByIdAndUpdate(orderId, {
    status: process.env.INPROCESS,
    deliveryPrice: deliveryPrice,
    address: address,
  });
  const allGroupOrderItem = await OrderItem.find({ orderId });
  await Promise.all(
    allGroupOrderItem.map(async (item) => {
      item.isPaid = true;
      await item.save();
    })
  );
  const newPayment = await new Payment({
    orderId,
    description: description,
    status: "Paid",
    email: email,
  });
  await newPayment.save();
  res.status(201).json({
    status: 201,
  });
});

paymentRouter.post("/sendmail", async (req, res) => {
  try {
    const { email, orderId, message } = req.body;
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      port: 465,
      secure: true,
      auth: {
        user: "sneakerproject.final@gmail.com",
        pass: "Password@123",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const content = `
        <div style="padding: 10px; background-color: #003375">
            <div style="padding: 10px; background-color: white;">
                <h4 style="color: #0085ff">Checkout successfuly for Order: #${orderId}</h4>
                <span style="color: black">Thank you for choose our services!</span>
                 <span style="color: black">Description: ${message}</span>
            </div>
        </div>
    `;

    const mailOptions = {
      from: "Sneaker",
      to: email,
      subject: `Checkout successfuly for Order #${orderId}}`,
      html: content,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      status: 200,
      orderId: "mail sent",
      email: email,
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = paymentRouter;
