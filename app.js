const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  let today = new Date();

  let currentDate = today.toLocaleDateString("en-US", options);

  res.render("list", { currentDate: currentDate });
});

app.post("/", (postReq, postRes) => {
  let newItem = postReq.body.newItem;
  console.log(newItem);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

// Functions
