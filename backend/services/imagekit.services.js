// const ImageKit = require('imagekit');
// const { v4: uuidv4 } = require("uuid")



// const imagekit = new ImageKit({
//     publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'test_public',
//     privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'test_private',
//     urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/demo',
// });

// async function uploadImage({ buffer, folder = '/barber-book' }) {
//     const res = await imagekit.upload({
//         file: buffer,
//         fileName: uuidv4(),
//         folder,
//     });
//     console.log("Image Response" , res);
    
//     return {
//         url: res.url,
//         thumbnail: res.thumbnailUrl || res.url,
//         id: res.fileId,
//     };
// }

// async function deleteImage(fileId) {
//     await imagekit.deleteFile(fileId);
// }

// module.exports = { imagekit, uploadImage , deleteImage };



const ImageKit = require("imagekit");
const { v4: uuidv4 } = require("uuid");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "test_public",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "test_private",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/demo",
});

async function uploadImage({
  buffer,
  fileName,
  folder = "/barber-book",
  tags = [],
}) {
  if (!buffer) {
    throw new Error("Buffer is required for upload");
  }

  const finalFileName = fileName || uuidv4();

  const res = await imagekit.upload({
    file: buffer,
    fileName: finalFileName,
    folder,
    useUniqueFileName: true,
    tags,
  });

  console.log("ImageKit Upload Response:", res);

  return {
    url: res.url,
    thumbnail: res.thumbnailUrl || res.url,
    id: res.fileId,
    name: res.name,
    filePath: res.filePath,
  };
}

async function deleteImage(fileId) {
  if (!fileId) {
    throw new Error("fileId is required");
  }

  await imagekit.deleteFile(fileId);
}

module.exports = {
  imagekit,
  uploadImage,
  deleteImage,
};