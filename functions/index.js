const functions = require("firebase-functions");
const express = require("express");
const helmet = require("helmet"); //a middleware to secure the app by adding different HTTP headers
const body_parser = require("body-parser"); //to parse the req.body content before the handlers
const cors = require("cors"); //to enable cross origin resource on the app
const method_override = require("method-override"); //to support different requests verbs like PUT and DELETE
const app = express();
app.use(body_parser.json({limit: "5mb"}));
app.use(body_parser.urlencoded({ extended: false }));
app.use(method_override());
app.use(helmet());
app.use(cors());
require("./routes")(app);
exports.api = functions.https.onRequest(app);