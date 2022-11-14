import { Router } from "express";
import authJwt from "../middleware/authJwt";
import SystemControl from "../models/systemControl";
import User from "../models/user";

const router = Router();

router.get("/", [authJwt.verifyToken], function (req, res) {
  SystemControl.findOne(
    { device_id: req.query.device_id },
    function (err, data) {
      if (!data) {
        res.status(404).send({ message: "Not Found" });
      } else {
        res.send(data);
      }
    }
  );
});

router.post("/add", [authJwt.verifyToken], function (req, res) {
  const mqttClient = req.mqttClient;
  const systemControlData = req.body;
  const query = { device_id: systemControlData.device_id };
  const topic = `dev/${systemControlData.device_id}/control`;
  const userId = req.userId;
  const upsertData = {
    user_id: systemControlData.user_id,
    device_id: systemControlData.device_id,
    plant_name: systemControlData.plant_name,
    date_planted: systemControlData.date_planted,
    plant_count: systemControlData.plant_count,
    installment: systemControlData.installment,
    lamp_status: systemControlData.lamp_status,
    ph_min: systemControlData.ph_min,
    ph_max: systemControlData.ph_max,
    tds_min: systemControlData.tds_min,
    tds_max: systemControlData.tds_max,
    spray_interval: systemControlData.spray_interval,
    spray_duration: systemControlData.spray_duration,
  };

  SystemControl.findOneAndUpdate(
    query,
    upsertData,
    { upsert: true },
    function (err) {
      if (err) return res.status(500).send({ error: err });
      return res.send("Succesfully saved.");
    }
  );

  User.findOneAndUpdate(
    { _id: userId },
    { device_id: systemControlData.device_id },
    { upsert: true },
    function (err) {
      if (err) return res.status(500).send({ error: err });
    }
  );

  mqttClient.publish(topic, JSON.stringify(upsertData));
});

router.put("/upsert", [authJwt.verifyToken], function (req, res) {
  const mqttClient = req.mqttClient;
  const systemControlData = req.body;
  const query = { device_id: systemControlData.device_id };
  const topic = `dev/${systemControlData.device_id}/control`;
  const upsertData = {
    ph_min: systemControlData.ph_min,
    ph_max: systemControlData.ph_max,
    tds_min: systemControlData.tds_min,
    tds_max: systemControlData.tds_max,
    spray_interval: systemControlData.spray_interval,
    spray_duration: systemControlData.spray_duration,
  };

  SystemControl.findOneAndUpdate(
    query,
    upsertData,
    { upsert: true },
    function (err) {
      if (err) return res.status(500).send({ error: err });
      return res.send("Succesfully saved.");
    }
  );

  mqttClient.publish(topic, JSON.stringify(upsertData));
});

export default router;
