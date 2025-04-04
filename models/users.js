const mongoose = require("mongoose");

const usersScheme = mongoose.Schema({
  nickname: { type: String, required: true , unique : true },
  places: [{ type: mongoose.Schema.Types.ObjectId, ref: "places" }],
});

const Users = mongoose.model("users", usersScheme);

module.exports = Users;
