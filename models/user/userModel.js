import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  new: {
    type: String,
    required: true,
  },
  created_by: {
    type: String,
    required: false,
  },

  accounts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: false,
    },
  ],
  associated_homes: [
    {
      primary: {
        type: String,
        required: true,
      },
      
    },
  ],
  password: {
    required: true,
    type: String,
  },
});

export default mongoose.model("User", userSchema);
