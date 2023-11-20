const express = require("express");
const app = express();
const users = require("../server/routes/users.js");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//const firebase = require('firebase');

app.use("/api/test", users);

app.get("/api", (request, response) => {
  response.send("Hello world from Express!");
});

app.listen(1234, () => {
  console.log("Running on port 1234!");
});
