const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function (req, res) {

    let date = new Date();

    let day = date.getDate();
    res.send(`<h1>${day.toString()}</h1>`);

});


app.listen(3000, () => {
    console.log("Server running on port 3000")
});