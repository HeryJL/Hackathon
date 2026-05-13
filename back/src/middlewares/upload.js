import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Dossiers de destination
const UPLOAD_DIR = 'uploads';
const FARMS_DIR = path.join(UPLOAD_DIR, 'farms');
const PRODUCTS_DIR = path.join(UPLOAD_DIR, 'products');
const AVATARS_DIR = path.join(UPLOAD_DIR, 'avatars');

// Créer les dossiers s'ils n'existent pas
[UPLOAD_DIR, FARMS_DIR, PRODUCTS_DIR, AVATARS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = UPLOAD_DIR;
    if (req.baseUrl.includes('farms')) folder = FARMS_DIR;
    else if (req.baseUrl.includes('products')) folder = PRODUCTS_DIR;
    else if (req.baseUrl.includes('profile')) folder = AVATARS_DIR;
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// Filtre pour n'accepter que les images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Seules les images sont autorisées'), false);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 Mo max
});