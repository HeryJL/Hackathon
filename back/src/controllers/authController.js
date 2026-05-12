const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../db/prisma'); // Import du singleton

const register = async (req, res) => {
  try {
    const { email, password, isProducteur } = req.body;
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Cet email est déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        isProducteur: isProducteur || false,
      }
    });

    res.status(201).json({ 
      message: "Utilisateur créé avec succès", 
      userId: user.id 
    });
  } catch (error) {
    console.error("Erreur Register:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    const token = jwt.sign(
      { id: user.id, isProducteur: user.isProducteur },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      token, 
      isProducteur: user.isProducteur,
      userId: user.id 
    });
  } catch (error) {
    console.error("Erreur Login:", error);
    res.status(500).json({ error: "Erreur lors de la connexion" });
  }
};

module.exports = { register, login };