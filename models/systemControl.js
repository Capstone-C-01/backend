import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

const systemControlSchema = new Schema(
  {
    user_id: String,
    device_id: String,
    plant_id: String,
    lamp_status: String,
    ph_min: Number,
    ph_max: Number,
    tds_min: Number,
    tds_max: Number,
    spray_interval: Date,
    spray_duration: Date,
    plant_count: Number,
  },
  {
    timestamps: true,
  }
);

const SystemControl = mongoose.model("SystemControl", systemControlSchema);

export default SystemControl;
