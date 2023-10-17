const express = require("express");
const { getDB } = require("../config/db");
const moment = require("moment/moment");
const router = express.Router();
require("moment-timezone");

// Create a new user
router.post("/register", async (req, res) => {
  console.log("req", req.body);
  const { name, email, password } = req.body;

  try {
    const db = getDB();

    // Check if the email is already taken
    const existingUser = await db.collection("users").findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create a new user
    const userObject = {
      name: name,
      email: email,
      password: password,
      createdAt: moment().tz("Asia/Kolkata").format("DD/MM/YYYY HH:mm:ss"),
      updatedAt: moment().tz("Asia/Kolkata").format("DD/MM/YYYY HH:mm:ss"),
    };
    const user = await db.collection("users").insertOne(userObject);
    console.log("user inserted: ", user);

    return res
      .status(201)
      .json({ message: "Congrats!! You are successfully registered" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/login", async (req, res) => {
  const { email, password } = req.query;

  try {
    const db = getDB();

    // Check if user exist
    const user = await db
      .collection("users")
      .findOne({ $and: [{ email: email }, { password: password }] });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Bad credentials. Please try again" });
    }
    console.log("user", user);
    return res.status(201).json({ message: "Successful login", id: user._id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
