import express from "express";
import session from "express-session";
import cors from "cors";
import { json, urlencoded } from "body-parser";
import { connect, connection } from "mongoose";
import {fs} from 'fs';
import module from 'path'

import "dotenv/config";

import routes from "./routes";
import withMQTT from "./middleware/withMQTT";
import setupMQTT from "./mqtt/mqtt_setup";

const MongoStore = require("connect-mongo")(session);

const app = express();

connect(
  "mongodb+srv://capstone01:satusampaidelapan@cluster-0.zn68d65.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "capstone-dev",
  },
  (err) => {
    if (!err) {
      console.log("MongoDB Connection Succeeded.");
    } else {
      console.log("Error in DB connection : " + err);
    }
  }
);

const db = connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {});

app.use(cors());

app.use(
  session({
    secret: "work hard",
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db,
    }),
  })
);

app.use(json());
app.use(urlencoded({ extended: false }));

const mqttClient = setupMQTT("dev/sensors");

app.use(withMQTT(mqttClient));

app.use("/", (req, res, next) => {
  next();
});

app.use("/sensors", routes.deviceSensor);
app.use("/users", routes.user);
app.use("/systems", routes.systemControl);
app.use("/imagegallery", routes.imageGallery);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error("File Not Found");
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res) {
  res.status(err.status || 500);
  res.send(err.message);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("Server is started on http://127.0.0.1:" + PORT);
});

const multer = require("multer");

const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'uploads')
  },
  filename: (req,file,cb)=>{
    cb(null,file.originalname)
  }
})

const upload = multer({storage:storage})