import prisma from '../prisma/client.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { deleteFile, getFilePath } from '../utils/fileUtils.js';

// Obtenir ou créer le profil
export const getProfile = asyncHandler(async (req, res) => {
  let profile = await prisma.profile.findUnique({
    where: { userId: req.user.id }
  });
  if (!profile) {
    profile = await prisma.profile.create({
      data: { userId: req.user.id }
    });
  }
  res.json(profile);
});

// Mettre à jour le profil (avec avatar)
export const updateProfile = asyncHandler(async (req, res) => {
  const { adresseLivraison, telephone, nomComplet } = req.body;
  const data = { adresseLivraison, telephone, nomComplet };

  // Gestion de l'avatar (fichier uploadé)
  if (req.file) {
    // Supprimer l'ancien avatar s'il existe
    const oldProfile = await prisma.profile.findUnique({
      where: { userId: req.user.id }
    });
    if (oldProfile?.avatar) {
      deleteFile(getFilePath(oldProfile.avatar));
    }
    data.avatar = req.file.path; // chemin relatif
  }

  const profile = await prisma.profile.upsert({
    where: { userId: req.user.id },
    update: data,
    create: { userId: req.user.id, ...data }
  });
  res.json(profile);
});