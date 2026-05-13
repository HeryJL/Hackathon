import prisma from '../prisma/client.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { deleteFile, getFilePath } from '../utils/fileUtils.js';

// Soumettre une demande pour devenir vendeur
export const createSellerRequest = asyncHandler(async (req, res) => {
  const { farmName, farmLocation, description } = req.body;
  const documentUrl = req.file ? req.file.path : null;

  const request = await prisma.sellerRequest.create({
    data: {
      userId: req.user.id,
      farmName,
      farmLocation,
      description,
      documentUrl
    }
  });
  res.status(201).json(request);
});

// Récupérer les demandes de l'utilisateur connecté
export const getUserSellerRequests = asyncHandler(async (req, res) => {
  const requests = await prisma.sellerRequest.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' }
  });
  res.json(requests);
});

// Admin : récupérer toutes les demandes
export const getAllSellerRequests = asyncHandler(async (req, res) => {
  // Vérification admin à faire via un middleware
  const requests = await prisma.sellerRequest.findMany({
    include: { user: { select: { id: true, email: true } } },
    orderBy: { createdAt: 'asc' }
  });
  res.json(requests);
});

// Admin : traiter une demande
export const processSellerRequest = asyncHandler(async (req, res) => {
  const requestId = parseInt(req.params.id);
  const { status, comment } = req.body;

  const request = await prisma.sellerRequest.findUnique({
    where: { id: requestId }
  });
  if (!request) return res.status(404).json({ error: 'Demande introuvable' });

  const updated = await prisma.$transaction(async (tx) => {
    const reqUpdated = await tx.sellerRequest.update({
      where: { id: requestId },
      data: {
        status,
        comment,
        reviewedBy: req.user.id, // admin id
        reviewedAt: new Date()
      }
    });

    if (status === 'APPROVED') {
      // Rendre l'utilisateur producteur ET créer une ferme automatiquement ?
      await tx.user.update({
        where: { id: request.userId },
        data: { isProducteur: true }
      });
      // Optionnel : créer une ferme avec les infos de la demande
      await tx.farm.create({
        data: {
          nom: request.farmName,
          localisation: request.farmLocation,
          ownerId: request.userId,
          certifie: false
        }
      });
    }
    return reqUpdated;
  });

  res.json(updated);
});