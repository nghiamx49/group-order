require("dotenv").config();
const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const errorhandler = require("errorhandler");
const morgan = require("morgan");
const passport = require("passport");
const passportConfig = require("./middleware/auth");
const authRouter = require("./routers/auth");
const tradeRouter = require("./routers/trademark");
const itemRouter = require("./routers/item");
const reviewRouter = require("./routers/review");
const addressRouter = require("./routers/address");
const orderRouter = require("./routers/order");
const paymentRouter = require("./routers/payment");
const orderItemRouter = require("./routers/order-item");
const adminRouter = require("./routers/admin"),
chatroomRouter = require('./routers/chatroom')
const { initialize, connectToMG, seeddata } = require("./services/service");
const groupOrderRouter = require("./routers/groupOrderIO");
const app = express();
const server = http.createServer(app);

global.__basedir = __dirname;

connectToMG();
initialize();
seeddata();

app.use(express.json());

app.use(express.static("/statics"));

app.use(cors({ origin: "*", credentials: false }));
app.use(passport.initialize());
app.use(morgan("dev"));
app.use("assets", express.static("assets"));
app.use("/api/auth", authRouter);
app.use("/api/trademark", tradeRouter);
app.use("/api/item", itemRouter);
app.use("/api/review", reviewRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/cart", orderItemRouter);
app.use("/api/admin", adminRouter);
app.use('/api/chatroom', chatroomRouter)
groupOrderRouter(server);

const PORT = process.env.PORT;

server.listen(PORT, () => console.log(`${server} started on port ${PORT}`));
