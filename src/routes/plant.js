import { Router } from "express";
import Plant from "../models/plant";

const router = Router();

router.get("/", function (req, res) {
  Plant.findOne({ user_id: req.body.user_id }, function (err, data) {
    if (!data) {
      res.send({ Status: "Can't found" });
    } else {
      res.send({
        plant_id: data._id,
        plant_name: data.plant_name,
        date_planted: data.date_planted,
        plant_count: data.plant_count,
      });
    }
  });
});

router.post("/add", function (req, res) {
  let plantInfo = req.body;

  var newPlant = new Plant({
    user_id: plantInfo.user_id,
    device_id: plantInfo.device_id,
    plant_name: plantInfo.plant_name,
    date_planted: plantInfo.date_planted,
    plant_count: plantInfo.plant_count,
  });
  newPlant.save(function (err, Plant) {
    if (err) res.send(err);
    else res.send(Plant);
  });
});

export default router;
