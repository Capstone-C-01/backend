import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

const systemControlSchema = new Schema(
  {
    user_id: { type: String, required: true },
    device_id: { type: String, required: true },
    plant_name: { type: String, required: true },
    date_planted: { type: Date, required: true },
    plant_count: { type: Number, required: true },
    installment: { type: String, required: true },
    lamp_status: { type: Boolean, required: true },
    ph_min: { type: Number, required: true },
    ph_max: { type: Number, required: true },
    tds_min: { type: Number, required: true },
    tds_max: { type: Number, required: true },
    spray_interval: { type: Number, required: true },
    spray_duration: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const SystemControl = mongoose.model("SystemControl", systemControlSchema);

export default SystemControl;
