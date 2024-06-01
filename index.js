const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const routeListVideos = require('./routes');
app.set("view engine", "ejs");

app.use(cors());
app.use(bodyParser.json());

app.use('/api/v1', routeListVideos)

app.listen(3001, () => {
    console.log("Server is running on port 3000");
});