const multer = require("multer");
const path = require("node:path");

const storageConfig = multer.diskStorage({
    destination: "medias",
    filename: (req, file, res) => {
        let uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2);
        let filename = uniqueId + file.originalname.substring(file.originalname.length - 4);
        res(null, filename);
    },
});

const fileFilterConfig = function (req, file, cb) {
    cb(null, true);
    // if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    //     cb(null, true);
    // } else {
    //     cb(null, false);
    // }
};

const upload = multer({
    storage: storageConfig,
    fileFilter: fileFilterConfig,
});

module.exports = upload;