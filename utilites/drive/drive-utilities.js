import config from "../../config.js";
import AWS from "aws-sdk";
import fs from "fs";
import path, { resolve } from "path";
import Folder from "../../models/drive/folderModel.js";
import File from "../../models/drive/fileModel.js";
import Drive from "../../models/drive/driveModel.js";
import {
  awsItemToDbFile,
  awsItemToDbFolder,
} from "../../parsers/drive/drive-parsers.js";

const {
  aws: { iam_user_key, iam_user_secret, bucket_name },
} = config;

const s3bucket = new AWS.S3({
  accessKeyId: iam_user_key,
  secretAccessKey: iam_user_secret,
  Bucket: bucket_name,
});

const baseParams = {
  Bucket: bucket_name,
};

export const createAwsDrive = async (drive_id) => {
  return new Promise((resolve) => {
    s3bucket.upload(
      {
        ...baseParams,
        Key: `${drive_id}/`,
        Body: "",
      },
      (err, data) => {
        if (err) throw err;
        resolve(data);
      }
    );
  });
};

export const createAwsFolder = async (folder) => {
  const { path, name } = folder;
  return new Promise((resolve) => {
    s3bucket.upload(
      {
        ...baseParams,
        Key: `${path}${name}/`,
        Body: "",
      },
      (err, data) => {
        if (err) throw err;
        console.log(data);
        resolve(data);
      }
    );
  });
};
export const createAwsFile = async (file) => {
  const { path, name } = file;
  return new Promise((resolve) => {
    s3bucket.upload(
      {
        ...baseParams,
        Key: `${path}${name}`,
        Body: "",
      },
      (err, data) => {
        if (err) throw err;
        console.log(data);
        resolve(data);
      }
    );
  });
};

export const populateFoldersRecursive = async (folders) =>
  Promise.all(
    folders.map(async (folder) => {
      const foundFolder = await Folder.findOne({ _id: folder._id });
      const { folders } = folder;
      return {
        ...foundFolder.toObject(),
        folders: folders.length ? populateFoldersRecursive(folders) : [],
      };
    })
  );

// export const buildDbObject = async (item, type) => {
//     console.log(item)
// // you may be able to just create everything from folder
// /// if ( folder.files ) map => file => new File()
// //  const newFolder = new Folder({ ...dbFolder });
//     switch(type) {
//         case 'file': {
//             const dbFile = awsItemToDbFile(item);
//             const newFile = new File({ ...dbFile });
//             await newFile.save();
//             break;
//         }
//         case 'folder': {
//             const dbFolder = awsItemToDbFolder(item);
//             console.log(item.files)
//             const newFolder = new Folder({ ...dbFolder });
//              await newFolder.save();
//         break;
//     }
//     // console.log(awsItems)
//     //   const file = new File({ name: 'File1', meta: { path: 'some path', url: 'url' } })
//     //   const savedFile = await file.save();
//     //   const folder = new Folder({
//     //     name: 'Folder1',
//     //     meta: {
//     //       path: 'some path for folder',
//     //       url: 'url to folder'
//     //     }, files: [savedFile._id], folders: []
//     //   })
//     //   const savedFolder = await folder.save();
//     //   const createdDrive = new Drive({ folders: [savedFolder._id]});
//     // return parseDriveFolders(awsItems.Contents, homeId)
//     }
// }

// export const getAwsItems = async (homeId) => {
//     return new Promise((resolve) => {
//         s3bucket.listObjects({
//             ...baseParams,
//             Delimiter: '/',
//             Prefix: `${homeId}/`
//         }, (err, data) => {
//             if (err) throw err;
//             resolve(data);
//         });

//     })
// }

// const createLocalItems = (folders) => folders.map(fl => fl.files.length && fl.files.map(file => fs.appendFileSync(file.name)));

// export const createAwsFolders = async (home_id, username) => {
//     // creates folders and files in s3 bucket
//     // also creates local files that are defined in baseFolders to read from
//     const baseFolders = [
//         { name: 'Shared', files: [] },
//         { name: username, files: [{ name: `${username}-welcome.txt`, body: `Welcome to Hubz, ${username}` }] }
//     ];
//     await createLocalItems(baseFolders);
//     const base_path = `${home_id}`;
//     await Promise.all(baseFolders.map(item => uploadAwsItem(base_path, item, 'folder')));
// }

// const uploadAwsItem = async (base_path, item, itemType) =>  {
//     const uploadingFile = itemType === 'file';

//     const Body = uploadingFile ? fs.readFileSync(item.name) : '';
//     const rootPath = `${base_path}/${item.name}${uploadingFile ? '' : '/'}`
//     s3bucket.upload({
//         ...baseParams,
//         Body,
//         Key: rootPath
//     },
//         async (err, data) => {
//             const dbItem = { ...item, meta: { ...data } }

//             // save to db when successful aws upload
//             await buildDbObject(dbItem, itemType)
//             if (err) throw err;
//             if (uploadingFile) fs.unlinkSync(item.name)
//             return item.files && item.files.length ?
//               {...await Promise.all(item.files.map(
//                     file => uploadAwsItem(`${base_path}/${item.name}`, file, 'file'))), ...data} : {};

// })

// }

// not using

export const getDriveContent = (homeId) => {
  return new Promise((resolve) => {
    var params = {
      Bucket: bucket_name,
      Prefix: `${homeId}/`,
    };
    s3bucket.createBucket(
      {
        Bucket: bucket_name,
      },
      () => {
        s3bucket.listObjects(params, (err, data) => {
          if (err) throw err;

          resolve(data);
        });
      }
    );
  });
};

export const parseDriveFolders = (contents, homeId) => {
  const heirachy = contents.map((directory) =>
    directory.Key.split("/").filter(
      (n) => n !== "" && n !== homeId && n.length > 1
    )
  );

  const newThing = heirachy.flatMap((directories) => [directories.join("/")]);
  const newerThing = newThing.filter((n) => n !== "");

  const buildFolders = (folderList, parentFolder) =>
    folderList.map((item) => {
      const mainFolder = [];
      if (parentFolder) mainFolder.push(`${parentFolder}/`);
      const itemCopy = [...item.split("/")];
      const [parent, ...children] = itemCopy;
      return {
        name: parent,
        type: parent.includes(".") ? "file" : "folder",
        meta: {
          extension: parent.split(".") ? parent.split(".")[1] : null,
          path: `/${mainFolder.join("/")}${parent}`,
          url: `https://${bucket_name}.s3.amazonaws.com/${homeId}/${mainFolder.join(
            "/"
          )}${parent}`,
        },
        folders: children ? buildFolders(children, parent) : [],
      };
    });
  const folders = buildFolders(newerThing);

  folders.forEach((fl, index) => {
    if (index > 0) {
      if (folders[index - 1].name == fl.name) {
        const foundIndex = folders.findIndex(
          (n) => n.name === folders[index - 1].name
        );
        folders.splice(foundIndex, 1);
      }
    }
  });
  return { folders };
};

const createBaseFiles = async (homeId, creator_name) => {
  const baseFiles = [`${creator_name}-welcome.txt`];

  const fileContent = fs.readFileSync(`${creator_name}-starter-file.txt`);
  const params = {
    Bucket: bucket_name,
    Body: fileContent,
  };
  baseFiles.map((fileName) =>
    s3bucket.upload(
      { ...params, Key: `${homeId}/${creator_name}/${fileName}` },
      function (err, data) {
        if (err) {
          throw err;
        }
      }
    )
  );
};

const createBaseFolders = async (homeId, creator_name) => {
  const baseFolders = ["Shared", creator_name];

  var params = {
    Bucket: bucket_name,
    Body: "body does not matter",
  };
  baseFolders.map((folderName) =>
    s3bucket.upload({ ...params, Key: `${homeId}/${folderName}/` }, function (
      err,
      data
    ) {
      if (err) {
      }
    })
  );

  fs.appendFile(
    `${creator_name}-starter-file.txt`,
    `Hello ${creator_name}, thanks for joining!">`,
    function (err) {
      if (err) throw err;
    }
  );
};

export const getDriveFile = async (homeId, path, res) => {
  const structuredPath = path.split(".");
  const fileExtension = structuredPath[structuredPath.length - 1];
  structuredPath.pop();
  const newPath = `${homeId}${structuredPath.join("/")}.${fileExtension}`;

  var params = {
    Bucket: bucket_name,
    Key: newPath,
  };

  var params = { Bucket: bucket_name, Key: newPath };
  s3bucket.getObject(params, (err, data) => {
    if (err) throw err;
  });
  res.attachment(newPath);
  var fileStream = s3bucket.getObject(params).createReadStream();

  fileStream.pipe(res);
};
