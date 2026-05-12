const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur (Acheteur par défaut)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        isProducteur: false, // Valeur par défaut
      }
    });

    res.status(201).json({ message: "Utilisateur créé", userId: user.id });
  } catch (error) {
    res.status(400).json({ error: "Email déjà utilisé ou données invalides" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Identifiants incorrects" });
  }

  // On inclut isProducteur dans le token pour faciliter l'affichage côté Front
  const token = jwt.sign(
    { id: user.id, isProducteur: user.isProducteur },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({ token, isProducteur: user.isProducteur });
};

module.exports = { register, login };