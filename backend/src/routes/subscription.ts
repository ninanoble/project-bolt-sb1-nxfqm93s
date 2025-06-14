import express from 'express';
import { User } from '../models/User';
import { auth } from '../middleware/auth';

const router = express.Router();

// Update subscription
router.post(
  '/update',
  auth,
  async (req: express.Request, res: express.Response) => {
    try {
      const { subscription } = req.body;
      
      if (!['free', 'premium'].includes(subscription)) {
        return res.status(400).json({ message: 'Invalid subscription type' });
      }

      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.subscription = subscription;
      await user.save();

      res.json({
        message: 'Subscription updated successfully',
        subscription: user.subscription
      });
    } catch (error) {
      res.status(500).json({ message: 'Error updating subscription' });
    }
  }
);

// Get current subscription
router.get(
  '/current',
  auth,
  async (req: express.Request, res: express.Response) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        subscription: user.subscription
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching subscription' });
    }
  }
);

export default router; 