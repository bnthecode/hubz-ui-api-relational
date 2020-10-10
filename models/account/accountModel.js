import mongoose from "mongoose";
const Schema = mongoose.Schema;

const accountSchema = new Schema({
  account_token: {
    type: String,
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  home_id: {
    type: Schema.Types.ObjectId,
    ref: "Home",
    required: true,
  },
  account_name: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Account", accountSchema);
