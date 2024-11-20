const multer = require("multer");

const storageConfig = multer.diskStorage({
    destination: "medias",
    filename: (req, file, res) => {
        let uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2);
        let filename = uniqueId + file.originalname.substring(file.originalname.length - 4);
        res(null, filename);
    },
});

const fileFilterConfig = function (req, file, cb) {
    const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg", "video/mp4"];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only PNG, JPEG, JPG, and MP4 files are allowed."), false); // Reject the file
    }
};

const upload = multer({
    storage: storageConfig,
    fileFilter: fileFilterConfig,
});

module.exports = upload;