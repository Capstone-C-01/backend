import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

const deviceSensorSchema = new Schema(
  {
    user_id: String,
    device_id: String,
    placement: String,
    lamp_status: String,
    water_level: Number,
    ph_data: Number,
    tds_data: Number,
  },
  {
    timestamps: true,
  }
);

const DeviceSensor = mongoose.model("DeviceSensor", deviceSensorSchema);

export default DeviceSensor;
