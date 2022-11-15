import express from "express";
import cors from "cors";
import cookieSession from "cookie-session";
import { connect, connection } from "mongoose";

import "dotenv/config";

import routes from "./routes";
import withMQTT from "./middleware/withMQTT";
import setupMQTT from "./mqtt/mqtt_setup";

const app = express();

const corsOption = {
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

connect(
  "mongodb+srv://capstone01:satusampaidelapan@cluster-0.zn68d65.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "capstone-dev",
    useFindAndModify: false,
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

app.use(cors(corsOption));

app.use(
  cookieSession({
    name: "capstone-c01-session",
    secret: process.env.COOKIE_SECRET,
    httpOnly: true,
  })
);

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mqttClient = setupMQTT([
  "dev/+/relay/+",
  "dev/+/sensors",
  "dev/+/control",
]);

app.use(withMQTT(mqttClient));

app.use("/sensors", routes.deviceSensor);
app.use("/control", routes.systemControl);
app.use("/auth", routes.auth);
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
  console.log("Server is started on localhost:" + PORT);
});
