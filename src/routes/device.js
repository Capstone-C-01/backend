import { Router } from "express";
import Device from "../../models/device";

const router = Router();

router.get("/", function (req, res) {
  Device.findOne(
    { user_id: req.body.user_id, device_id: req.body.device_id },
    function (err, data) {
      if (!data) {
        res.send({ Status: "Can't found" });
      } else {
        res.send({
          user_id: data._id,
          device_id: data.device_id,
          placement: data.placement,
          lamp_status: data.lamp_status,
          water_level: data.water_level,
          ph_data: data.ph_data,
          tds_data: data.tds_data,
        });
      }
    }
  );
});

router.post("/add", function (req, res) {
  let deviceInfo = req.body;

  var newDevice = new Device({
    user_id: deviceInfo.user_id,
    device_id: deviceInfo.device_id,
    placement: deviceInfo.placement,
    lamp_status: deviceInfo.lamp_status,
    water_level: deviceInfo.water_level,
    ph_data: deviceInfo.ph_data,
    tds_data: deviceInfo.tds_data,
  });
  newDevice.save(function (err, Device) {
    if (err) res.send(err);
    else res.send(Device);
  });
});

export default router;
