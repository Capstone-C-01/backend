import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  device_id: { type: String, default: "" },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

export default User;
