const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Endpoints
const Endpoints = {
  HOMEPAGE: "/",
  WORK: "/work",
  ABOUT: "/about",
  DELETE: "/delete",
  CUSTOMLISTNAME: "/:customListName",
};

// Mongo Connection
mongoose.connect(
  "mongodb+srv://alan_admin:alan_admin@todo-cluster-axvqp.mongodb.net/todolistDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const itemsSchema = {
  name: {
    type: String,
    required: true,
  },
};

const listSchema = {
  name: String,
  items: [itemsSchema],
};

const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List", listSchema);

const item1 = new Item({
  name: "Welcome to your Todo list 👋",
});
const item2 = new Item({
  name: "Click ^ to add new Item",
});
const item3 = new Item({
  name: "👈 Select this checkbox to delete an item",
});

const defaultItems = [item1, item2, item3];
let recentlyVisited = [];

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
        recentlyVisited: recentlyVisited,
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

app.get(Endpoints.CUSTOMLISTNAME, (req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  if (!recentlyVisited.includes(customListName) && recentlyVisited.length < 4) {
    recentlyVisited.push(customListName);
  } else if (
    recentlyVisited.includes(customListName) &&
    recentlyVisited.length < 4
  ) {
    _.remove(recentlyVisited, (n) => n === customListName);
    recentlyVisited.push(customListName);
  } else if (
    !recentlyVisited.includes(customListName) &&
    recentlyVisited.length === 4
  ) {
    _.remove(recentlyVisited, (n) => n === customListName);
    recentlyVisited.splice(0, 1);
    recentlyVisited.push(customListName);
  } else if (
    recentlyVisited.includes(customListName) &&
    recentlyVisited.length === 4
  ) {
    _.remove(recentlyVisited, (n) => n === customListName);
    recentlyVisited.push(customListName);
  }

  List.findOne({ name: customListName }, (err, results) => {
    if (!err) {
      if (!results) {
        console.log(`List ${customListName} doesn't exist. Creating one...`);
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        list.save();
        res.redirect(`/${customListName}`);
      } else {
        res.render("list", {
          recentlyVisited: recentlyVisited,
          listTitle: `${_.capitalize(customListName)}`,
          newItems: results.items,
          endpoint: `/${customListName}`,
          deleteEndpoint: Endpoints.DELETE,
        });
      }
    }
  });
});

app.post(Endpoints.DELETE, (req, res) => {
  let checkedItemId = req.body.checkbox;
  const listTitle = req.body.listTitle;

  if (listTitle === "Today") {
    Item.findByIdAndDelete(checkedItemId, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`SUCCESSFULLY DELETED ITEM WITH ID ${checkedItemId}`);
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      { name: listTitle },
      { $pull: { items: { _id: checkedItemId } } },
      (err, results) => {
        if (!err) {
          res.redirect("/" + listTitle);
        }
      }
    );
  }
});

app.post(Endpoints.CUSTOMLISTNAME, (req, res) => {
  newItem = req.body.newItem;
  const customListName = req.params.customListName;
  List.findOne({ name: customListName }, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      results.items.push({ name: newItem });
      results.save();
      res.redirect(`/${customListName}`);
    }
  });
});

app.get(Endpoints.ABOUT, (req, res) => {
  res.render("about");
});

// Run on port
app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port 3000");
});

// Functions
