import express from "express";
import session from "express-session";
import cors from "cors";
import { json, urlencoded } from "body-parser";
import { connect, connection } from "mongoose";

import "dotenv/config";

const MongoStore = require("connect-mongo")(session);

const app = express();
connect(
  "mongodb+srv://capstone01:satusampaidelapan@cluster-0.zn68d65.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
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

app.use("/", (req, res) => {
  res.send("Hello, it's the backend of Capstone C-01");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error("File Not Found");
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("Server is started on http://127.0.0.1:" + PORT);
});
