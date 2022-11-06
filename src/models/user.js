import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  user_id: String,
  email: String,
  username: String,
  password: String,
  passwordConf: String,
});

const User = mongoose.model("User", userSchema);

export default User;
