import multer from 'multer';
import path from 'path';

console.log("Error in llmPdfUploaderChat: 11"); 
// Configure storage
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, 'tempFolder/'); // store in 'uploads' folder
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const allowedExtensions = ['.pdf', '.docx'];

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Only ${allowedExtensions.join(', ')} files are allowed`));
  }
};

// Multer middleware
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // Max file size: 100MB
});
