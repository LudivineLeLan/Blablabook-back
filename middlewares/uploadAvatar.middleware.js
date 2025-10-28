import multer from 'multer';
import path from 'path';

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/avatars/'), // cb = callback de Multer 
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // évite les conflits
    const ext = path.extname(file.originalname); // récupère l'extension du fichier original 
    cb(null, 'avatar-' + uniqueSuffix + ext); // appelle le callback avec le nom final 
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) cb(null, true); // MIME = décrit le type de fichier ou de contenu 
  else cb(new Error('Type de fichier non autorisé'));
};

const avatarUpload = multer({ storage: avatarStorage, fileFilter });

export default avatarUpload;