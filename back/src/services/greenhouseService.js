const { PrismaClient } = require('@prisma/client');

// On passe l'URL directement au constructeur
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

module.exports = prisma;