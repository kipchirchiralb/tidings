// trial multer middlware- for uploading files to server
//  trial uuid - providing unique identifer to image filenames
// sharp toresize the images
// const multer = require("multer");
// const upload = multer({
//   limits: {
//     fileSize: 8 * 1024 * 1024,
//   },
// });
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

class Resize {
  constructor(folder) {
    this.folder = folder;
  }
  save(buffer) {
    const filename = Resize.filename();
    const filepath = this.filepath(filename);

    sharp(buffer)
      .resize(300, 300, {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .toFile(filepath);

    return filename;
  }
  static filename() {
    return `${uuidv4()}.png`;
  }
  filepath(filename) {
    return path.resolve(`${this.folder}/${filename}`);
  }
}

module.exports.Resize= Resize
// module.exports.upload = upload
