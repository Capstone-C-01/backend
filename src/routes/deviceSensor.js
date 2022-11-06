import { Router } from "express";
import DeviceSensor from "../models/deviceSensor";

const router = Router();

router.get("/", function (req, res) {
  req.mqttClient.publish("dev/sensors", "From SENSORS");
  res.send("From sensors");
  // DeviceSensor.findOne(
  //   { user_id: req.body.user_id, device_id: req.body.device_id },
  //   function (err, data) {
  //     if (!data) {
  //       res.send({ Status: "Can't found" });
  //     } else {
  //       res.send({
  //         user_id: data._id,
  //         device_id: data.device_id,
  //         placement: data.placement,
  //         lamp_status: data.lamp_status,
  //         water_level: data.water_level,
  //         ph_data: data.ph_data,
  //         tds_data: data.tds_data,
  //       });
  //     }
  //   }
  // );
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
    else res.send(Device);
  });
});

export default router;
