const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth'); // Import du middleware
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Seul un utilisateur AVEC un token valide peut accéder à cette route
router.post('/add', authenticateToken, async (req, res) => {
  const { nom, localisation, images } = req.body;
  
  try {
    const newFarm = await prisma.farm.create({
      data: {
        nom,
        localisation,
        images,
        ownerId: req.user.id, // L'ID vient du token décodé par le middleware
      }
    });
    res.status(201).json(newFarm);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'ajout de la ferme." });
  }
});

module.exports = router;