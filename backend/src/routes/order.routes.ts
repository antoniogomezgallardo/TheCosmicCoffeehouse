import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

const router = Router();

// Simple order schema for MVP
const OrderSchema = new mongoose.Schema({
  userId: String,
  sessionId: String,
  items: Array,
  total: Number,
  shippingAddress: Object,
  status: { type: String, default: 'confirmed' },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     description: Places a new order with cart items and shipping information
 *     tags:
 *       - Orders
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - total
 *               - shippingAddress
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID (optional for guest checkout)
 *                 example: '507f1f77bcf86cd799439011'
 *               sessionId:
 *                 type: string
 *                 description: Session ID for guest checkout
 *                 example: 'session_12345'
 *               items:
 *                 type: array
 *                 description: Array of cart items
 *                 items:
 *                   $ref: '#/components/schemas/CartItem'
 *               total:
 *                 type: number
 *                 description: Order total amount
 *                 example: 299.99
 *               shippingAddress:
 *                 type: object
 *                 required:
 *                   - firstName
 *                   - lastName
 *                   - address
 *                   - city
 *                   - zipCode
 *                   - country
 *                 properties:
 *                   firstName:
 *                     type: string
 *                     example: 'John'
 *                   lastName:
 *                     type: string
 *                     example: 'Doe'
 *                   address:
 *                     type: string
 *                     example: '123 Cosmic Street'
 *                   city:
 *                     type: string
 *                     example: 'New York'
 *                   zipCode:
 *                     type: string
 *                     example: '10001'
 *                   country:
 *                     type: string
 *                     example: 'USA'
 *     responses:
 *       201:
 *         description: Order successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *                 message:
 *                   type: string
 *                   example: 'Order placed successfully!'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, sessionId, items, total, shippingAddress } = req.body;

    const order = new Order({
      userId: userId || 'guest',
      sessionId,
      items,
      total,
      shippingAddress,
      orderNumber: `ORD-${Date.now()}`
    });

    await order.save();

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order placed successfully!'
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
 * /api/orders/user/{userId}:
 *   get:
 *     summary: Get user's order history
 *     description: Retrieves all orders for a specific user, sorted by creation date (newest first)
 *     tags:
 *       - Orders
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID to get orders for
 *         schema:
 *           type: string
 *           example: '507f1f77bcf86cd799439011'
 *     responses:
 *       200:
 *         description: Successfully retrieved user orders
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
 *                     $ref: '#/components/schemas/Order'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders
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
 * /api/orders/{id}:
 *   get:
 *     summary: Get order details
 *     description: Retrieves detailed information for a specific order by ID
 *     tags:
 *       - Orders
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: '507f1f77bcf86cd799439011'
 *     responses:
 *       200:
 *         description: Successfully retrieved order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'Order not found'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;