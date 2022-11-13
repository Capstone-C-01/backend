import { Router } from "express";
import DeviceSensor from "../models/deviceSensor";
import SystemControl from "../models/systemControl";

const router = Router();

router.get("/", function (req, res) {
  const { device_id } = req.query;
  DeviceSensor.find({ device_id: device_id }, function (err, data) {
    if (data.length <= 0) {
      res.status(404).send(`No sensors data found for device ${device_id}`);
    } else {
      res.send(data);
    }
  });
});

router.post("/add", function (req, res) {
  const deviceSensorData = req.body;

  const newDeviceSensor = new DeviceSensor({
    user_id: deviceSensorData.user_id,
    device_id: deviceSensorData.device_id,
    lamp_status: deviceSensorData.lamp_status,
    water_level: deviceSensorData.water_level,
    ph_data: deviceSensorData.ph_data,
    tds_data: deviceSensorData.tds_data,
  });

  newDeviceSensor.save(function (err, Device) {
    if (err) res.send(err);
    else res.status(200).send(Device);
  });
});

router.post("/relay", function (req, res) {
  const mqttClient = req.mqttClient;
  const relayControl = req.body;
  // const mqttClient = req.mqttClient;
  const topic = `dev/${relayControl.device_id}/relay/${relayControl.relay_number}`;
  const payload = relayControl.status;

  const query = { device_id: relayControl.device_id };
  const upsertData = {
    lamp_status: relayControl.status === "on" ? true : false,
  };

  try {
    SystemControl.findOneAndUpdate(
      query,
      upsertData,
      { upsert: true },
      (err) => {
        if (err) console.log(err);
      }
    );
    mqttClient.publish(topic, payload);
    res.status(200).send("Success set relay status");
  } catch (error) {
    res.status(500).send("Something wrong when sending data to device");
  }
});

export default router;
