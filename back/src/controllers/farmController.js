import prisma from '../prisma/client.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { deleteFile, getFilePath } from '../utils/fileUtils.js';

// Créer une ferme (avec images)
export const createFarm = asyncHandler(async (req, res) => {
  const { nom, localisation, certifie } = req.body;
  const images = req.files ? req.files.map(f => f.path) : [];

  const farm = await prisma.farm.create({
    data: {
      nom,
      localisation,
      certifie: certifie === 'true',
      ownerId: req.user.id,
      images
    }
  });
  res.status(201).json(farm);
});

// Récupérer toutes les fermes d'un utilisateur
export const getUserFarms = asyncHandler(async (req, res) => {
  const farms = await prisma.farm.findMany({
    where: { ownerId: req.user.id },
    include: { products: true }
  });
  res.json(farms);
});

// Récupérer une ferme par ID (avec produits)
export const getFarmById = asyncHandler(async (req, res) => {
  const farm = await prisma.farm.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { products: true, owner: { select: { id: true, email: true } } }
  });
  if (!farm) return res.status(404).json({ error: 'Ferme introuvable' });
  res.json(farm);
});

// Mettre à jour une ferme (gestion des images)
export const updateFarm = asyncHandler(async (req, res) => {
  const farmId = parseInt(req.params.id);
  const { nom, localisation, certifie } = req.body;
  const farm = await prisma.farm.findFirst({
    where: { id: farmId, ownerId: req.user.id }
  });
  if (!farm) return res.status(404).json({ error: 'Ferme non trouvée ou accès refusé' });

  const data = {};
  if (nom) data.nom = nom;
  if (localisation) data.localisation = localisation;
  if (certifie) data.certifie = certifie === 'true';

  // Gestion des nouvelles images
  if (req.files && req.files.length > 0) {
    // Supprimer les anciennes images
    farm.images.forEach(img => deleteFile(getFilePath(img)));
    data.images = req.files.map(f => f.path);
  }

  const updated = await prisma.farm.update({
    where: { id: farmId },
    data,
    include: { products: true }
  });
  res.json(updated);
});

// Supprimer une ferme (et ses images)
export const deleteFarm = asyncHandler(async (req, res) => {
  const farmId = parseInt(req.params.id);
  const farm = await prisma.farm.findFirst({
    where: { id: farmId, ownerId: req.user.id }
  });
  if (!farm) return res.status(404).json({ error: 'Ferme non trouvée' });

  // Supprimer les images de la ferme
  if (farm.images?.length) {
    farm.images.forEach(img => deleteFile(getFilePath(img)));
  }

  // (Optionnel) Supprimer aussi les produits associés et leurs images
  const products = await prisma.product.findMany({ where: { farmId } });
  for (const product of products) {
    if (product.images?.length) {
      product.images.forEach(img => deleteFile(getFilePath(img)));
    }
  }
  await prisma.product.deleteMany({ where: { farmId } });

  await prisma.farm.delete({ where: { id: farmId } });
  res.status(204).send();
});