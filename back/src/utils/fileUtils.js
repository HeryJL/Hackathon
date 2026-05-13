// utils/fileUtils.js
import fs from 'fs';
import path from 'path';

export const deleteFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export const getFilePath = (relativePath) => path.join(process.cwd(), relativePath);