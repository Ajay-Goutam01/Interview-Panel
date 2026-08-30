import multer from "multer";
import ApiError from "../utils/apiError.js";

const allowedAudioTypes = [
  "audio/webm",
  "audio/wav",
  "audio/mpeg",
  "audio/mp4",
  "audio/x-m4a",
  "audio/m4a",
];

const audioFileFilter = (req, file, cb) => {
  if (!allowedAudioTypes.includes(file.mimetype)) {
    return cb(new ApiError(400, "Only supported audio files are allowed"));
  }

  cb(null, true);
};

const audioUpload = multer({
  storage: multer.memoryStorage(),

  fileFilter: audioFileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
  },
});

export default audioUpload;
