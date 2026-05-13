import prisma from '../prisma/client.js';   // chemin correct

import { asyncHandler } from '../utils/asyncHandler.js';
import bcrypt from 'bcrypt';

// Récupérer tous les utilisateurs (admin seulement)
export const getUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    include: { profile: true, farms: true }
  });
  res.json(users);
});

// Récupérer son propre profil
export const getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { profile: true, farms: true, cart: true }
  });
  res.json(user);
});

// Mettre à jour son profil utilisateur (email, password, isProducteur)
export const updateUser = asyncHandler(async (req, res) => {
  const { email, password, isProducteur } = req.body;
  const data = {};
  if (email) data.email = email;
  if (password) data.password = await bcrypt.hash(password, 10);
  if (typeof isProducteur === 'boolean') data.isProducteur = isProducteur;

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data,
    include: { profile: true }
  });
  res.json(user);
});