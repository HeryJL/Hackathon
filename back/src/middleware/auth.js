const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Récupération du header Authorization (Format: "Bearer TOKEN")
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Accès refusé. Token manquant." });
  }

  try {
    // Vérification du token avec votre clé secrète (définie dans .env)
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    // On ajoute les infos de l'utilisateur à l'objet 'req' 
    // pour les utiliser dans les routes (ex: req.user.id)
    req.user = verified;
    
    next(); // On passe à la fonction suivante (le contrôleur)
  } catch (err) {
    res.status(403).json({ error: "Token invalide ou expiré." });
  }
};

module.exports = authenticateToken;