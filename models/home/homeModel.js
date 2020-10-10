import mongoose from "mongoose";
const Schema = mongoose.Schema;

const homeSchema = new Schema({
  home_name: {
    type: String,
    required: true,
  },
  home_password: {
    type: String,
    required: true,
  },
  home_type: {
    type: String,
    required: true,
  },
  creator_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  primary_home: {
    type: String,
    required: true
  },
  home_users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  accounts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: false,
    },
  ],
  calendar_id: {
    type: Schema.Types.ObjectId,
    ref: "Drive",
    required: false,
  },
  drive_id: {
    type: Schema.Types.ObjectId,
    ref: "Drive",
    required: false,
  },
});

export default mongoose.model("home", homeSchema);
