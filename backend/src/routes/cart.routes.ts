import { Router, Request, Response } from 'express';

const router = Router();

// In-memory cart storage for MVP (would use Redis or DB in production)
const carts: Map<string, any[]> = new Map();

/**
 * @swagger
 * /api/cart/{sessionId}:
 *   get:
 *     summary: Get shopping cart contents
 *     description: Retrieves all items in the shopping cart for a specific session
 *     tags:
 *       - Shopping Cart
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         description: Unique session identifier for the cart
 *         schema:
 *           type: string
 *           example: 'session_12345'
 *     responses:
 *       200:
 *         description: Successfully retrieved cart contents
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CartItem'
 */
router.get('/:sessionId', (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const cart = carts.get(sessionId) || [];

  res.json({
    success: true,
    data: cart
  });
});

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add item to shopping cart
 *     description: Adds a product (capsule or machine) to the shopping cart or increases quantity if already present
 *     tags:
 *       - Shopping Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *               - product
 *             properties:
 *               sessionId:
 *                 type: string
 *                 description: Unique session identifier
 *                 example: 'session_12345'
 *               product:
 *                 type: object
 *                 description: Product to add to cart
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Product ID
 *                   productType:
 *                     type: string
 *                     enum: ['capsule', 'machine']
 *                     description: Type of product
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 default: 1
 *                 description: Quantity to add
 *                 example: 2
 *     responses:
 *       200:
 *         description: Item successfully added to cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CartItem'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/cart/update:
 *   put:
 *     summary: Update item quantity in cart
 *     description: Updates the quantity of a specific item in the shopping cart
 *     tags:
 *       - Shopping Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *               - productId
 *               - quantity
 *             properties:
 *               sessionId:
 *                 type: string
 *                 description: Unique session identifier
 *                 example: 'session_12345'
 *               productId:
 *                 type: string
 *                 description: Product ID to update
 *                 example: '507f1f77bcf86cd799439011'
 *               quantity:
 *                 type: integer
 *                 minimum: 0
 *                 description: New quantity (0 removes item)
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart item successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CartItem'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/cart/remove/{sessionId}/{productId}:
 *   delete:
 *     summary: Remove item from cart
 *     description: Completely removes a specific item from the shopping cart
 *     tags:
 *       - Shopping Cart
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         description: Unique session identifier
 *         schema:
 *           type: string
 *           example: 'session_12345'
 *       - in: path
 *         name: productId
 *         required: true
 *         description: Product ID to remove
 *         schema:
 *           type: string
 *           example: '507f1f77bcf86cd799439011'
 *     responses:
 *       200:
 *         description: Item successfully removed from cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CartItem'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/cart/clear:
 *   post:
 *     summary: Clear entire cart
 *     description: Removes all items from the shopping cart for a specific session
 *     tags:
 *       - Shopping Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *             properties:
 *               sessionId:
 *                 type: string
 *                 description: Unique session identifier
 *                 example: 'session_12345'
 *     responses:
 *       200:
 *         description: Cart successfully cleared
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Cart cleared'
 */
router.post('/clear', (req: Request, res: Response) => {
  const { sessionId } = req.body;
  carts.delete(sessionId);

  res.json({
    success: true,
    message: 'Cart cleared'
  });
});

export default router;