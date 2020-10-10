import mongoose from "mongoose";
import { ChildFolder, ChildFile } from "./folderModel.js";
const Schema = mongoose.Schema;

const Drive = new Schema({
  folders: [ChildFolder],
  files: [ChildFile],
  location: {
    type: String,
    required: false,
  },
  path: {
    type: String,
    required: false,
  },
  creator_id: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Drive", Drive);
