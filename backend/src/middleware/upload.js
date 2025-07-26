// middleware/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Create upload directory if it doesn't exist
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Dynamic storage config
const getStorage = (folder) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = `uploads/${folder}`;
      ensureDirExists(dir);
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      const dir = `uploads/${folder}`;
      const fullPath = path.join(dir, file.originalname);

      // Delete the file if it already exists
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }

      cb(null, file.originalname); // Save with original name
    },
  });

// Separate upload handlers
export const imagesUpload = multer({ storage: getStorage("images") });
