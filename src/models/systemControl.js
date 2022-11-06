import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

const systemControlSchema = new Schema(
  {
    user_id: String,
    device_id: String,
    plant_name: String,
    date_planted: Date,
    plant_count: Number,
    installment: String,
    lamp_status: Boolean,
    ph_min: Number,
    ph_max: Number,
    tds_min: Number,
    tds_max: Number,
    spray_interval: Number,
    spray_duration: Number,
  },
  {
    timestamps: true,
  }
);

const SystemControl = mongoose.model("SystemControl", systemControlSchema);

export default SystemControl;
