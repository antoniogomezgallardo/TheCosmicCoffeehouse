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

// Create order
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

// Get user orders
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

// Get single order
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