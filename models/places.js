const mongoose = require("mongoose");

const placesScheme = mongoose.Schema({
  name: { type: String, required: true },
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
});

const Places = mongoose.model("places", placesScheme);

module.exports = Places;
