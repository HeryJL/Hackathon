import prisma from '../prisma/client.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Obtenir le panier de l'utilisateur connecté
export const getCart = asyncHandler(async (req, res) => {
  let cart = await prisma.cart.findUnique({
    where: { userId: req.user.id },
    include: {
      items: {
        include: { product: true }
      }
    }
  });
  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: req.user.id },
      include: { items: { include: { product: true } } }
    });
  }
  res.json(cart);
});

// Ajouter un article au panier
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;
  const qty = parseInt(quantity) || 1;

  // Vérifier le produit et son stock
  const product = await prisma.product.findUnique({
    where: { id: parseInt(productId) }
  });
  if (!product) return res.status(404).json({ error: 'Produit introuvable' });
  if (product.stock < qty) return res.status(400).json({ error: 'Stock insuffisant' });

  // Récupérer ou créer le panier
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  // Vérifier si l'article existe déjà dans le panier
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: { cartId: cart.id, productId: parseInt(productId) }
    }
  });

  if (existingItem) {
    const newQuantity = existingItem.quantity + qty;
    if (product.stock < newQuantity) return res.status(400).json({ error: 'Stock insuffisant pour la quantité totale' });
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity }
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: parseInt(productId),
        quantity: qty
      }
    });
  }

  const updatedCart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } }
  });
  res.json(updatedCart);
});

// Mettre à jour la quantité d'un article
export const updateCartItem = asyncHandler(async (req, res) => {
  const { itemId, quantity } = req.body;
  const userId = req.user.id;
  const newQty = parseInt(quantity);

  if (newQty <= 0) {
    // Supprimer l'article
    await prisma.cartItem.deleteMany({
      where: { id: parseInt(itemId), cart: { userId } }
    });
  } else {
    // Vérifier le stock
    const item = await prisma.cartItem.findFirst({
      where: { id: parseInt(itemId), cart: { userId } },
      include: { product: true }
    });
    if (!item) return res.status(404).json({ error: 'Article non trouvé' });
    if (item.product.stock < newQty) return res.status(400).json({ error: 'Stock insuffisant' });
    await prisma.cartItem.update({
      where: { id: parseInt(itemId) },
      data: { quantity: newQty }
    });
  }

  const updatedCart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } }
  });
  res.json(updatedCart);
});

// Vider le panier
export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
  res.status(204).send();
});