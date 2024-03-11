const multer = require("multer");
const path = require("path");

// 이미지 파일
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error("허용되지 않는 파일 형식입니다. \n허용 확장자: .jpg, .png, .jpeg");
        error.code = "INCORRECT_FILETYPE";
        return cb(error, false);
    }
    cb(null, true);
};

// multer
const uploadDetail = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "uploads/");
        },
        filename: (req, file, done) => {
            const extension = path.extname(file.originalname); // 확장자
            done(null, path.basename(file.originalname, extension) + Date.now() + extension); // Date.now()는 날짜를 입력하는 목적이 아닌 중복 방지를 위해 ms 단위의 값을 넣어주려는 것임
        },
    }),
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = uploadDetail;
