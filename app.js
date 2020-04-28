const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const newItems = [];
const workItems = [];
const Endpoints = {
  HOMEPAGE: "/",
  WORK: "/work",
  ABOUT: "/about",
};

let newItem;
let currentDate;

app.get(Endpoints.HOMEPAGE, function (req, res) {
  currentDate = date.getDay();
  res.render("list", {
    listTitle: currentDate,
    newItems: newItems,
    endpoint: Endpoints.HOMEPAGE,
  });
});

app.post(Endpoints.HOMEPAGE, (postReq, postRes) => {
  newItem = postReq.body.newItem;
  newItems.push(newItem);
  postRes.redirect(Endpoints.HOMEPAGE);
});

app.get(Endpoints.WORK, (req, res) => {
  res.render("list", {
    listTitle: "Work Items",
    newItems: workItems,
    endpoint: Endpoints.WORK,
  });
});

app.post(Endpoints.WORK, (req, res) => {
  newItem = req.body.newItem;
  workItems.push(newItem);
  res.redirect(Endpoints.WORK);
});

app.get(Endpoints.ABOUT, (req, res) => {
  res.render("about");
});
// Run on port
app.listen(3000, () => {
  console.log("Server running on port 3000");
});

// Functions
