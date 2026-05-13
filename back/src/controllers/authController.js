import prisma from '../prisma/client.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';

// Inscription
export const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  // Vérifier si l'utilisateur existe déjà
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ error: 'Cet email est déjà utilisé' });
  }

  // Hacher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Créer l'utilisateur
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      isProducteur: false, // par défaut
    },
  });

  // Créer automatiquement un profil vide
  await prisma.profile.create({
    data: { userId: user.id,  },
  });

  // Ne pas renvoyer le mot de passe
  const { password: _, ...userWithoutPassword } = user;
  res.status(201).json({ message: 'Compte créé avec succès', user: userWithoutPassword });
});

// Connexion
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  // Trouver l'utilisateur
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  }

  // Vérifier le mot de passe
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  }

  // Générer un token JWT
  const token = jwt.sign(
    { id: user.id, email: user.email, isProducteur: user.isProducteur },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Renvoyer le token et les infos utilisateur (sans mot de passe)
  const { password: _, ...userWithoutPassword } = user;
  res.json({ token, user: userWithoutPassword });
});