import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

const deviceSchema = new Schema(
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

const Device = mongoose.model("Device", deviceSchema);

export default Device;
