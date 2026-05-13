import prisma from '../prisma/client.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Générer un numéro de commande unique
const generateOrderNumber = () => {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

// Créer une commande à partir du panier
export const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { shippingAddress, paymentMethod, promoCode } = req.body;

  // Récupérer le panier avec les produits
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } }
  });

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ error: 'Panier vide' });
  }

  // Vérifier les stocks et calculer le total
  let totalAmount = 0;
  const orderItemsData = [];
  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      return res.status(400).json({ error: `Stock insuffisant pour ${item.product.name}` });
    }
    const totalPrice = item.quantity * item.product.price;
    totalAmount += totalPrice;
    orderItemsData.push({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.product.price,
      totalPrice
    });
  }

  // Appliquer une réduction (exemple simple)
  let discount = 0;
  if (promoCode === 'PROMO10') discount = totalAmount * 0.1;

  const finalAmount = totalAmount - discount;

  // Créer la commande
  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      buyerId: userId,
      totalAmount: finalAmount,
      paymentMethod,
      shippingAddress,
      discount,
      promoCode,
      items: { create: orderItemsData }
    },
    include: { items: { include: { product: true } } }
  });

  // Mettre à jour les stocks des produits
  for (const item of cart.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } }
    });
  }

  // Vider le panier
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  res.status(201).json(order);
});

// Récupérer les commandes de l'utilisateur
export const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { buyerId: req.user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json(orders);
});

// Récupérer une commande par ID
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await prisma.order.findFirst({
    where: { id: parseInt(req.params.id), buyerId: req.user.id },
    include: { items: { include: { product: true } } }
  });
  if (!order) return res.status(404).json({ error: 'Commande introuvable' });
  res.json(order);
});

// Annuler une commande (seulement si en attente)
export const cancelOrder = asyncHandler(async (req, res) => {
  const orderId = parseInt(req.params.id);
  const order = await prisma.order.findFirst({
    where: { id: orderId, buyerId: req.user.id, status: 'PENDING' }
  });
  if (!order) return res.status(404).json({ error: 'Commande non trouvée ou non annulable' });

  // Restituer les stocks
  const items = await prisma.orderItem.findMany({
    where: { orderId },
    include: { product: true }
  });
  for (const item of items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { increment: item.quantity } }
    });
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: 'CANCELLED' }
  });
  res.json({ message: 'Commande annulée' });
});