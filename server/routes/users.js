const express = require("express");
const router = express.Router();
const { db } = require("../../util/admin.js");

// Sample API route
router.get("/", (req, res) => {
  getUsers().then((data) => {
    return res.status(200).send(data);
  });
});

async function getUsers() {
  console.log("hello");
  const collection = db.collection("users").doc("test");
  let users = await collection.get();
  return users;
}

module.exports = { router, getUsers };
