import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

const deviceSensorSchema = new Schema(
  {
    user_id: { type: String, required: true },
    device_id: { type: String, required: true },
    lamp_status: { type: String, required: true },
    water_level: { type: Number, required: true },
    ph_data: { type: Number, required: true },
    tds_data: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const DeviceSensor = mongoose.model("DeviceSensor", deviceSensorSchema);

export default DeviceSensor;
