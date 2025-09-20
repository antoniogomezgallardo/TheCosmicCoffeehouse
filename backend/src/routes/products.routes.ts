import { Router, Request, Response } from 'express';
import Capsule from '../models/Capsule';
import Machine from '../models/Machine';

const router = Router();

/**
 * @swagger
 * /api/products/capsules:
 *   get:
 *     summary: Get all active capsules
 *     description: Retrieves a list of all active superpower coffee capsules from the catalog
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Successfully retrieved capsules
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
 *                     $ref: '#/components/schemas/Capsule'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/products/capsules/{id}:
 *   get:
 *     summary: Get single capsule by ID
 *     description: Retrieves a specific superpower coffee capsule by its ID and increments view count
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the capsule
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: '507f1f77bcf86cd799439011'
 *     responses:
 *       200:
 *         description: Successfully retrieved capsule
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Capsule'
 *       404:
 *         description: Capsule not found
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
 *                   example: 'Capsule not found'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/products/machines:
 *   get:
 *     summary: Get all active quantum brewing machines
 *     description: Retrieves a list of all active quantum brewing machines from the catalog
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Successfully retrieved machines
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
 *                     $ref: '#/components/schemas/Machine'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/products/machines/{id}:
 *   get:
 *     summary: Get single quantum brewing machine by ID
 *     description: Retrieves a specific quantum brewing machine by its ID and increments view count
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the machine
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: '507f1f77bcf86cd799439011'
 *     responses:
 *       200:
 *         description: Successfully retrieved machine
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Machine'
 *       404:
 *         description: Machine not found
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
 *                   example: 'Machine not found'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/products/featured:
 *   get:
 *     summary: Get featured products
 *     description: Retrieves a curated selection of premium capsules (epic/legendary rarity) and high-end quantum brewing machines for the homepage showcase
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Successfully retrieved featured products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     capsules:
 *                       type: array
 *                       description: Featured premium superpower coffee capsules
 *                       maxItems: 4
 *                       items:
 *                         $ref: '#/components/schemas/Capsule'
 *                     machines:
 *                       type: array
 *                       description: Featured high-end quantum brewing machines
 *                       maxItems: 4
 *                       items:
 *                         $ref: '#/components/schemas/Machine'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/featured', async (req: Request, res: Response) => {
  try {
    const capsules = await Capsule.find({
      isActive: true,
      rarity: { $in: ['epic', 'legendary'] }
    }).limit(4);

    const machines = await Machine.find({
      isActive: true,
      price: { $gte: 10000 }
    }).limit(4);

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