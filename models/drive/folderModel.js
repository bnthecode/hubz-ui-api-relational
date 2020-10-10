import mongoose from "mongoose";
const Schema = mongoose.Schema;

export const ChildFile = new Schema({
  name: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  path: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: true,
  },
  required: false,
});

export const ChildFolder = new Schema({
  name: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  path: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  files: [],
  folders: [],
  required: false,
});
// DB schema
const Folder = new Schema({
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
  type: {
    type: String,
    required: true,
  },
  files: [ChildFile],
  folders: [ChildFolder],
});

export default mongoose.model("Folder", Folder);
