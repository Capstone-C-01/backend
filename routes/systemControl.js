import { Router } from "express";
import Device from "../models/device";
import SystemControl from "../models/systemControl";

const router = Router();

router.get("/", function (req, res) {
  SystemControl.findOne({ user_id: req.body.user_id }, function (err, data) {
    if (!data) {
      res.send({ Status: "Can't found" });
    } else {
      res.send({
        user_id: data._id,
        device_id: data.device_id,
        lamp_status: data.lamp_status,
        ph_min: data.ph_min,
        ph_max: data.ph_max,
        tds_min: data.tds_min,
        tds_max: data.tds_max,
        spray_interval: data.spray_interval,
        spray_duration: data.spray_duration,
      });
    }
  });
});

router.post("/add", function (req, res) {
  let systemcontrollInfo = req.body;
  var newSystemControll = new SystemControl({
    user_id: systemcontrollInfo.user_id,
    device_id: systemcontrollInfo.device_id,
    lamp_status: systemcontrollInfo.lamp_status,
    ph_min: systemcontrollInfo.ph_min,
    ph_max: systemcontrollInfo.ph_max,
    tds_min: systemcontrollInfo.tds_min,
    tds_max: systemcontrollInfo.tds_max,
    spray_interval: systemcontrollInfo.spray_interval,
    spray_duration: systemcontrollInfo.spray_duration,
  });
  newSystemControll.save(function (err, SystemControll) {
    if (err) res.send(err);
    else res.send(SystemControll);
  });
});

// getreportdata routes
router.get("/reportdata", function (req, res) {
  Device.findOne(
    { user_id: req.body.user_id, device_id: req.body.device_id },
    function (err, data) {
      if (!data) {
        res.send({ Status: "Can't found" });
      } else {
        res.send({
          user_id: data._id,
          device_id: data.device_id,
          lamp_status: data.lamp_status,
          water_level: data.water_level,
          ph_data: data.ph_data,
          tds_data: data.tds_data,
        });
      }
    }
  );
});

export default router;
