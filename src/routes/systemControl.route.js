import { Router } from "express";
import SystemControl from "../models/systemControl";

const router = Router();

router.get("/", function (req, res) {
  SystemControl.findOne(
    { device_id: req.query.device_id },
    function (err, data) {
      if (!data) {
        res.send({ Status: "Can't found" });
      } else {
        res.send(data);
      }
    }
  );
});

router.put("/upsert", function (req, res) {
  const mqttClient = req.mqttClient;
  const systemControlData = req.body;
  const query = { device_id: systemControlData.device_id };
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

      mqttClient.publish(
        `dev/${systemControlData.device_id}/control`,
        upsertData
      );
      return res.send("Succesfully saved.");
    }
  );
});

export default router;
