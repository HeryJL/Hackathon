import prisma from '../prisma/client.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { deleteFile, getFilePath } from '../utils/fileUtils.js';

// Créer un produit (avec images) - seul un vendeur/propriétaire de ferme peut
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, quantity, unit, category, stock, isAvailable, isOrganic, farmId } = req.body;
  const images = req.files ? req.files.map(f => f.path) : [];

  // Vérifier que la ferme appartient bien à l'utilisateur
  const farm = await prisma.farm.findFirst({
    where: { id: parseInt(farmId), ownerId: req.user.id }
  });
  if (!farm) return res.status(403).json({ error: 'Accès non autorisé à cette ferme' });

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      unit,
      category,
      stock: stock !== undefined ? parseInt(stock) : parseInt(quantity),
      isAvailable: isAvailable === 'true',
      isOrganic: isOrganic === 'true',
      farmId: parseInt(farmId),
      sellerId: req.user.id,
      images
    }
  });
  res.status(201).json(product);
});

// Récupérer tous les produits (avec filtres)
export const getProducts = asyncHandler(async (req, res) => {
  const { category, isAvailable, isOrganic, minPrice, maxPrice, search } = req.query;
  const where = {};

  if (category) where.category = category;
  if (isAvailable) where.isAvailable = isAvailable === 'true';
  if (isOrganic) where.isOrganic = isOrganic === 'true';
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }

  const products = await prisma.product.findMany({
    where,
    include: { farm: true, seller: { select: { email: true } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json(products);
});

// Récupérer un produit par ID
export const getProductById = asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { farm: true, seller: true }
  });
  if (!product) return res.status(404).json({ error: 'Produit introuvable' });
  res.json(product);
});

// Mettre à jour un produit
export const updateProduct = asyncHandler(async (req, res) => {
  const productId = parseInt(req.params.id);
  const product = await prisma.product.findFirst({
    where: { id: productId, sellerId: req.user.id }
  });
  if (!product) return res.status(404).json({ error: 'Produit non trouvé ou accès refusé' });

  const { name, description, price, quantity, unit, category, stock, isAvailable, isOrganic } = req.body;
  const data = {};
  if (name) data.name = name;
  if (description !== undefined) data.description = description;
  if (price) data.price = parseFloat(price);
  if (quantity) data.quantity = parseInt(quantity);
  if (unit) data.unit = unit;
  if (category) data.category = category;
  if (stock !== undefined) data.stock = parseInt(stock);
  if (isAvailable) data.isAvailable = isAvailable === 'true';
  if (isOrganic) data.isOrganic = isOrganic === 'true';

  // Gestion des images
  if (req.files && req.files.length > 0) {
    product.images.forEach(img => deleteFile(getFilePath(img)));
    data.images = req.files.map(f => f.path);
  }

  const updated = await prisma.product.update({
    where: { id: productId },
    data
  });
  res.json(updated);
});

// Supprimer un produit
export const deleteProduct = asyncHandler(async (req, res) => {
  const productId = parseInt(req.params.id);
  const product = await prisma.product.findFirst({
    where: { id: productId, sellerId: req.user.id }
  });
  if (!product) return res.status(404).json({ error: 'Produit non trouvé' });

  product.images.forEach(img => deleteFile(getFilePath(img)));
  await prisma.product.delete({ where: { id: productId } });
  res.status(204).send();
});