const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UsersSchema = mongoose.Schema(
  {
    username: String,
    password: String,
    fullname: String,
    currentGroupOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Orders",
    },
    currentChatroomId: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chatrooms'
    },
    image: { type: String, default: "" },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: "Roles" },
    isOnline: {type: Boolean, default: false},
    socketId: String,
  },
  {
    timestamps: true,
  }
);

UsersSchema.pre("save", async function (next) {
  // Hash the password before saving the user model
  try {
    const user = this;
    if (!user.isModified("password")) {
      return next();
    }
    user.password = await bcrypt.hash(user.password, 8);
    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: { mesBody: "Cannot hash password" }, mesError: true });
    next(error);
  }
});

UsersSchema.methods.comparePassword = function (password, callback) {
  // Compare user password
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) {
      return callback(err);
    } else {
      if (!isMatch) {
        return callback(null, false);
      }
      return callback(null, this); // expreess: req.user
    }
  });
};

module.exports = mongoose.model("Users", UsersSchema);
