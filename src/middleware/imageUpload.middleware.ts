const multer = require("multer");

const storage = multer.diskStorage({
  destination: "public/images",
  filename: function (req, file, cb) {
    console.log("Reached multer file");
    let ext = file.originalname.substring(
      file.originalname.lastIndexOf("."),
      file.originalname.length
    );

    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    if (!allowedExtensions.includes(ext)) {
      return cb(
        new Error(
          "Invalid file type. Only JPG, JPEG, PNG, and GIF files are allowed."
        )
      );
    }
    // const filename = Date.now() + ext;
    console.log("From middleware ");
    cb(null, Date.now() + ext);
  },
});

// console.log("filename from outside the function:", filename)
export const upload = multer({ dest: "public/images", storage: storage });
// export const postMiddleware={
//     upload,
//     filename
// }
