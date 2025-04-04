var express = require("express");
const Places = require("../models/places");
const Users = require("../models/users");
var router = express.Router();

router.post("/", async (req, res) => {
  const { nickname, name, latitude, longitude } = req.body;

  try {
    const placeExists = await Places.exists({ name, latitude, longitude });
    const userExists = await Users.exists({ nickname });

    if (placeExists && userExists) {
      const { modifiedCount } = await Users.updateOne(userExists, {
        $addToSet: { places: placeExists._id },
      });
      res.json({
        result: Boolean(modifiedCount),
      });
      return;
    }

    if (userExists) {
      let newPlace = new Places({ name, latitude, longitude });
      await newPlace.save();
      const { modifiedCount } = await Users.updateOne(userExists, {
        $push: { places: newPlace._id },
      });
      res.json({
        result: Boolean(modifiedCount),
      });
      return;
    }

    if (placeExists) {
      let newUser = new Users({ nickname, places: [placeExists._id] });
      await newUser.save();
      res.json({
        result: true,
      });
      return;
    }

    let newPlace = new Places({ name, latitude, longitude });
    await newPlace.save();
    let newUser = new Users({ nickname, places: [newPlace._id] });
    await newUser.save();
    res.json({ result: true });
  } catch (e) {
    console.log(e);
    res.json({ result: false, error: e });
  }
});

router.get("/:nickname", async (req, res) => {
  const { nickname } = req.params;

  const data = await Users.findOne({ nickname });

  data && (await data.populate("places"));

  res.json({
    result: Boolean(data),
    places: data?.places.map(({ name, longitude, latitude }) => {
      return {
        name,
        longitude,
        latitude,
        nickname,
      };
    }),
  });
});

router.delete("/", async (req, res) => {
  const { nickname, name } = req.body;
  const namedPlaces = await Places.find({ name }, "_id").then((data) =>
    data.map((d) => d._id)
  );
  const { modifiedCount } = await Users.updateOne(
    { nickname },
    { $pullAll: { places: namedPlaces } }
  );
  res.json({
    result: Boolean(modifiedCount),
  });
});

module.exports = router;
