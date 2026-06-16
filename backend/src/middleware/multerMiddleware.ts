import multer from "multer";
import path from "path";

const uploadPath = path.join(process.cwd(), "./public/data/uploads/");
if(!uploadPath){
    throw new Error("Upload path not found");
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.originalname
    );
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
  fileFilter: (req, file, cb) => {
    const isPdf = file.mimetype === "application/pdf" && path.extname(file.originalname).toLowerCase() === ".pdf";
    if (isPdf) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF documents (.pdf) are supported."));
    }
  },
});
export default upload;
