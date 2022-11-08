import express from "express";
import session from "express-session";
import cors from "cors";
import { json, urlencoded } from "body-parser";
import { connect, connection } from "mongoose";

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

const mqttClient = setupMQTT([
  "/dev/sensors/add",
  "/dev/sensors/add/response",
  "/dev/sensors/control",
]);

app.use(withMQTT(mqttClient));

app.use("/sensors", routes.deviceSensor);
app.use("/users", routes.user);
app.use("/systems", routes.systemControl);
app.use("/", (req, res, next) => {
  res.send("This is Capstone-C01 BE");
  next();
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
  next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("Server is started on http://127.0.0.1:" + PORT);
});
