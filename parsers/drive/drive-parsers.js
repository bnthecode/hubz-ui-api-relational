export const awsItemToDbFile = (awsObj) => ({
  name: awsObj.name,
  meta: {
    path: awsObj.meta.Key,
    url: awsObj.meta.Location,
  },
});

export const awsItemToDbFolder = (awsObj) => ({
  name: awsObj.name,
  meta: {
    path: awsObj.meta.Key,
    url: awsObj.meta.Location,
  },
  // files: awsObj.files || [],
  // folders: awsObj.folders || []
});

// name: {
//     type: String,
//     required: true,
// },
// meta: {
//     path: {
//         type: String,
//         required: true,
//     },
//     url: {
//         type: String,
//         required: true,
//     }
// },
// files: [{
//     type: Schema.Types.ObjectId,
//     ref: 'File',
//     required: false,
// }],
// folders: [{
//     type: Schema.Types.ObjectId,
//     ref: 'Folder',
//     required: false,
// }],

// name: '12312321-welcome.txt',
// body: 'Welcome to Hubz, 12312321',
// meta: {
//   ETag: '"e21cc36bf0d65014c717a481a3f8a468"',
//   ServerSideEncryption: 'AES256',
//   Location: 'https://hubz.s3.us-east-2.amazonaws.com/5f6d3323b38adc8168b048c4/12312321/12312321-welcome.txt',
//   key: '5f6d3323b38adc8168b048c4/12312321/12312321-welcome.txt',
//   Key: '5f6d3323b38adc8168b048c4/12312321/12312321-welcome.txt',
//   Bucket: 'hubz'
