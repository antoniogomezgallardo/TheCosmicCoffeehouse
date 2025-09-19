import { Router, Request, Response } from 'express';
import Capsule from '../models/Capsule';
import Machine from '../models/Machine';

const router = Router();

// Get all capsules
router.get('/capsules', async (req: Request, res: Response) => {
  try {
    const capsules = await Capsule.find({ isActive: true })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: capsules
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single capsule
router.get('/capsules/:id', async (req: Request, res: Response) => {
  try {
    const capsule = await Capsule.findById(req.params.id);

    if (!capsule) {
      return res.status(404).json({
        success: false,
        message: 'Capsule not found'
      });
    }

    // Increment views
    capsule.views += 1;
    await capsule.save();

    res.json({
      success: true,
      data: capsule
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all machines
router.get('/machines', async (req: Request, res: Response) => {
  try {
    const machines = await Machine.find({ isActive: true })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: machines
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single machine
router.get('/machines/:id', async (req: Request, res: Response) => {
  try {
    const machine = await Machine.findById(req.params.id);

    if (!machine) {
      return res.status(404).json({
        success: false,
        message: 'Machine not found'
      });
    }

    // Increment views
    machine.views += 1;
    await machine.save();

    res.json({
      success: true,
      data: machine
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get featured products (mix of capsules and machines)
router.get('/featured', async (req: Request, res: Response) => {
  try {
    const capsules = await Capsule.find({
      isActive: true,
      rarity: { $in: ['epic', 'legendary'] }
    }).limit(3);

    const machines = await Machine.find({
      isActive: true,
      price: { $gte: 10000 }
    }).limit(3);

    res.json({
      success: true,
      data: {
        capsules,
        machines
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;