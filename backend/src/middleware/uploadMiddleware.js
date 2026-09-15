import multer from "multer";
import path from "path";
import fs from "fs";

// =========================================================
// UPLOAD DIRECTORY
// =========================================================

const uploadDirectory = "src/uploads";

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

// =========================================================
// STORAGE
// =========================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    const safeName = `id-proof-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${extension}`;

    cb(null, safeName);
  },
});

// =========================================================
// ALLOWED MIME TYPES
// =========================================================

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/pdf",
]);

// =========================================================
// ALLOWED EXTENSIONS
// =========================================================

const allowedExtensions = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".pdf",
]);

// =========================================================
// FILE FILTER
// =========================================================

const fileFilter = (req, file, cb) => {
  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  const isMimeTypeAllowed =
    allowedMimeTypes.has(file.mimetype);

  const isExtensionAllowed =
    allowedExtensions.has(extension);

  if (
    isMimeTypeAllowed &&
    isExtensionAllowed
  ) {
    return cb(null, true);
  }

  return cb(
    new Error(
      "Only JPG, JPEG, PNG and PDF files are allowed."
    ),
    false
  );
};

// =========================================================
// MULTER CONFIGURATION
// =========================================================

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

export default upload;