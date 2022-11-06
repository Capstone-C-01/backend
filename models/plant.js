import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

const plantSchema = new Schema({
  user_id: String,
  device_id: String,
  plant_id: String,
  plant_name: String,
  date_planted: Date,
  plant_count: Number,
});

const Plant = mongoose.model("Plant", plantSchema);

export default Plant;
