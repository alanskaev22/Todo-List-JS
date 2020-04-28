const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

let today = new Date();
let newItems = [];
let newItem = "";
let currentDate = "";

app.get("/", function (req, res) {
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  currentDate = today.toLocaleDateString("en-US", options);

  res.render("list", { currentDate: currentDate, newItems: newItems });
});

app.post("/", (postReq, postRes) => {
  newItem = postReq.body.newItem;
  newItems.push(newItem);
  postRes.redirect("/");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

// Functions
