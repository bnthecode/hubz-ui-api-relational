import {
  createAwsDrive,
  createAwsFile,
  createAwsFolder,
  populateFoldersRecursive,
} from "../utilites/drive/drive-utilities.js";
import Drive from "../models/drive/driveModel.js";
import queryString from "query-string";
import Folder from "../models/drive/folderModel.js";
import Home from "../models/home/homeModel.js";
import File from "../models/drive/fileModel.js";

export const createDrive = async (req, res) => {
  try {
    const { user_id } = req;
    const drive = new Drive({ creator_id: user_id });
    const foundHome = await Home.findOne({ creator_id: user_id });
    const awsDrive = await createAwsDrive(drive._id);
    drive.location = awsDrive.Location;
    drive.path = awsDrive.Key;
    const savedDrive = await drive.save();
    foundHome.drive_id = savedDrive._id;
    await foundHome.save();

    res
      .status(201)
      .send({
        drive: savedDrive,
        message: { content: "Successfully created drive" },
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        message: {
          content: "An error occurred creating your drive",
          info: error.message,
        },
      });
  }
};

export const getDrive = async (req, res) => {
  try {
    const { drive_id } = req.params;
    const drive = await Drive.findOne({ _id: drive_id });
    const folders = await populateFoldersRecursive(drive.folders);
    const uiDrive = {
      ...drive.toObject(),
      folders: folders,
    };
    res
      .status(200)
      .send({
        drive: uiDrive,
        message: { content: "Successfully retreived drive" },
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        message: {
          content: "An error occurred creating your file",
          info: error.message,
        },
      });
  }
};
// this is actually creating a folder inside only the root
export const createFolder = async (req, res) => {
  try {
    const { drive_id } = req.params;
    const { folder } = req.body;
    const { name } = folder;
    /// may need to fetch by path
    const drive = await Drive.findOne({ _id: drive_id });
    const awsFolder = await createAwsFolder(folder);

    const folderObj = {
      name: name || "a nameless folder..",
      path: awsFolder.Key || "idk to be honest",
      location: awsFolder.Location || "idk to be totally candid",
      type: "folder",
    };
    // creating folder in db as the same thats created on a drive,
    // but when we start saving heavier folder objects this should change
    const createdFolder = new Folder({
      ...folderObj,
    });

    const savedFolder = await createdFolder.save();
    drive.folders.push({
      // folders will probably have a lot of extra crap in the future.
      // just add simple info to the drive for now
      _id: savedFolder._id,
      ...folderObj,
    });
    const savedDrive = await drive.save();
    const folders = await populateFoldersRecursive(savedDrive.folders);
    res
      .status(200)
      .send({
        folders: folders,
        message: { content: "Successfully created folder" },
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        message: {
          content: "An error occurred creating your folder",
          info: error.message,
        },
      });
  }
};
export const getFolder = async (req, res) => {
  try {
    const { folder_id } = req.params;
    const folder = await Folder.findOne({ _id: folder_id });
    res
      .status(200)
      .send({ folder, message: { content: "Successfully retreived folder" } });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        message: {
          content: "An error occurred creating your file",
          info: error.message,
        },
      });
  }
};

export const createFile = async (req, res) => {
  try {
    const { folder_id, drive_id } = req.params;
    const drive = await Drive.findOne({ _id: drive_id });
    const { file } = req.body;
    const { name } = file;
    const folder = await Folder.findOne({ _id: folder_id });
    const awsFolder = await createAwsFile(file);

    const fileObj = {
      name: name || "a nameless file..",
      path: awsFolder.Key,
      location: awsFolder.Location,
      type: "file",
    };
    // creating file in db as the same thats created on a folder,
    // but when we start saving heavier file objects this should change
    const createdFile = new File({
      ...fileObj,
    });

    const savedFile = await createdFile.save();
    folder.files.push({
      // folders will probably have a lot of extra crap in the future.
      // just add simple info to the drive for now
      _id: savedFile._id,
      ...fileObj,
    });
    await folder.save();
    const folders = await populateFoldersRecursive(drive.folders);
    // only decent way to send back is an update drive folder list, we are not saving
    // to the main drive as all the folders save, and it gets populated recursively
    res
      .status(200)
      .send({
        folders: folders,
        message: { content: "Successfully created folder" },
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        message: {
          content: "An error occurred creating your file",
          info: error.message,
        },
      });
  }
};

export const getFile = async (req, res) => {
  res.status(200).send({ file: "" });
};
