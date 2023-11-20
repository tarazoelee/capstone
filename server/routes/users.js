const express = require("express");
const router = express.Router();
const { db } = require("../../util/admin.js");

// Sample API route
router.get('/users', (req, res) => {
   try {
    getUsers().then((data) => {
      return res.status(200).send(data);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

async function getUsers(){
    console.log("hello")
    const users = db.collection("users").get();
    return users;
}

module.exports = router;