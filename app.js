const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Mongo Connection
mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const itemsSchema = {
  name: {
    type: String,
    required: true,
  },
};

// Endpoints
const Endpoints = {
  HOMEPAGE: "/",
  WORK: "/work",
  ABOUT: "/about",
  DELETE: "/delete",
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your Todo list!",
});
const item2 = new Item({
  name: "Click + to add new Item",
});
const item3 = new Item({
  name: "<---Select this checkbox to cross an item",
});

const defaultItems = [item1, item2, item3];

let newItem;

// METHODS
app.get(Endpoints.HOMEPAGE, function (req, res) {
  Item.find({}, (err, results) => {
    if (results.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully added default items to the DB");
        }
      });
      res.redirect(Endpoints.HOMEPAGE);
    } else {
      res.render("list", {
        listTitle: "Today",
        newItems: results,
        endpoint: Endpoints.HOMEPAGE,
        deleteEndpoint: Endpoints.DELETE,
      });
    }
  });
});

app.post(Endpoints.HOMEPAGE, (postReq, postRes) => {
  newItem = postReq.body.newItem;
  const item = new Item({
    name: newItem,
  });

  item.save();

  postRes.redirect(Endpoints.HOMEPAGE);
});

app.post(Endpoints.WORK, (req, res) => {
  newItem = req.body.newItem;
  res.redirect(Endpoints.WORK);
});

app.post(Endpoints.DELETE, (req, res) => {
  let checkedItemId = req.body.checkbox;
  Item.findByIdAndDelete(checkedItemId, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`SUCCESSFULLY DELETED ITEM WITH ID ${checkedItemId}`);
      res.redirect(Endpoints.HOMEPAGE);
    }
  });
});

app.get(Endpoints.ABOUT, (req, res) => {
  res.render("about");
});
// Run on port
app.listen(3000, () => {
  console.log("Server running on port 3000");
});

// Functions
