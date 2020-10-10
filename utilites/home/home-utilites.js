import config from "../../config.js";
import AWS from "aws-sdk";
import fs from "fs";
import path from "path";
import Cryptr from "cryptr";
import { v4 as uuidv4 } from "uuid";

const {
  home: { home_encryption_key },
  aws: { iam_user_key, iam_user_secret, bucket_name },
} = config;
const s3bucket = new AWS.S3({
  accessKeyId: iam_user_key,
  secretAccessKey: iam_user_secret,
  Bucket: bucket_name,
});

export const createHomeDrive = async (homeId, creator_name) => {
  s3bucket.createBucket(async () => {
    var params = {
      Bucket: bucket_name,
      Key: `${homeId}/`,
      Body: "body does not matter",
    };
    s3bucket.upload(params, (err) => {
      if (err) throw err;
      createBaseFolders(homeId, creator_name);
    });
  });
};

export const getHomeDriveContent = (homeId) => {
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
      // GOD refactor this plz
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
  /// extract folder metadata and store in ui db, icon, color, name,
  //  folder content to be stored in aws

  return { folders };
};

const createBaseFiles = async (homeId, creator_name) => {
  const baseFiles = [`${creator_name}-welcome.html`];
  const fileContent = fs.readFileSync(`${creator_name}-starter-file.html`);
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

        fs.unlinkSync(
          path.relative(process.cwd(), `${creator_name}-starter-file.html`)
        );
      }
    )
  );
};

const createBaseFolders = async (homeId, creator_name) => {
  const baseFolders = ["Shared", creator_name];

  s3bucket.createBucket(async () => {
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
          throw err;
        }
      })
    );
  });

  // not really sure how should we download / preview files
  fs.appendFile(
    `${creator_name}-starter-file.html`,
    `<a href="data:${creator_name}-starter-file.html" target="_blank">`,
    function (err) {
      if (err) throw err;
      createBaseFiles(homeId, creator_name);
    }
  );
};

export const generateHomeAccessToken = (privileges) => {
  return `hubz_${uuidv4}`;
};

// export const generateHomeDriveAccessKey = (privileges) => {
//         const decryptedToken = cryptr.decrypt(acct.account_token);
// }

export const getHomeDriveFile = async (homeId, path, res) => {
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

  // res.status(200).send('ok')
  // console.log(await s3bucket.getObject(params))
  res.attachment(newPath);
  var fileStream = s3bucket.getObject(params).createReadStream();

  fileStream.pipe(res);
};
