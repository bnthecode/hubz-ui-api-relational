import mongoose from "mongoose";
const Schema = mongoose.Schema;

const File = new Schema({
  name: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
});

export default mongoose.model("File", File);
