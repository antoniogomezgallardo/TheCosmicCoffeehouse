import { Router, Request, Response } from 'express';

const router = Router();

// In-memory cart storage for MVP (would use Redis or DB in production)
const carts: Map<string, any[]> = new Map();

// Get cart
router.get('/:sessionId', (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const cart = carts.get(sessionId) || [];

  res.json({
    success: true,
    data: cart
  });
});

// Add to cart
router.post('/add', (req: Request, res: Response) => {
  try {
    const { sessionId, product, quantity = 1 } = req.body;

    let cart = carts.get(sessionId) || [];

    // Check if product already in cart
    const existingItemIndex = cart.findIndex(
      item => item.product.id === product.id && item.productType === product.productType
    );

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({
        product,
        productType: product.productType || 'capsule',
        quantity
      });
    }

    carts.set(sessionId, cart);

    res.json({
      success: true,
      data: cart
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update quantity
router.put('/update', (req: Request, res: Response) => {
  try {
    const { sessionId, productId, quantity } = req.body;

    let cart = carts.get(sessionId) || [];
    const itemIndex = cart.findIndex(item => item.product.id === productId);

    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = quantity;
      }
    }

    carts.set(sessionId, cart);

    res.json({
      success: true,
      data: cart
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Remove from cart
router.delete('/remove/:sessionId/:productId', (req: Request, res: Response) => {
  try {
    const { sessionId, productId } = req.params;

    let cart = carts.get(sessionId) || [];
    cart = cart.filter(item => item.product.id !== productId);

    carts.set(sessionId, cart);

    res.json({
      success: true,
      data: cart
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Clear cart
router.post('/clear', (req: Request, res: Response) => {
  const { sessionId } = req.body;
  carts.delete(sessionId);

  res.json({
    success: true,
    message: 'Cart cleared'
  });
});

export default router;