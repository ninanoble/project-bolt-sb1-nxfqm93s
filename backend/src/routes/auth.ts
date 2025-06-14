import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User';
import { sendVerificationEmail } from '../utils/email';

const router = express.Router();

// Signup route
router.post(
  '/signup',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').trim().notEmpty(),
    body('subscribeNewsletter').optional().isBoolean()
  ],
  async (req: express.Request, res: express.Response) => {
    try {
      const { email, password, name, subscribeNewsletter } = req.body;
      console.log('Received signup request:', { email, name, subscribeNewsletter });

      // Validate input
      if (!email || !password || !name) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log('User already exists:', email);
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create new user with isVerified set to true
      const user = new User({
        email,
        password,
        name,
        isVerified: true, // Automatically verify the user
        newsletterSubscribed: subscribeNewsletter || false
      });

      await user.save();
      console.log('User created successfully:', email);

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.status(201).json({
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          isVerified: true,
          subscription: user.subscription,
          newsletterSubscribed: user.newsletterSubscribed
        }
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Error creating user' });
    }
  }
);

// Login route
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').exists()
  ],
  async (req: express.Request, res: express.Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET || 'your-super-secret-jwt-key',
        { expiresIn: '7d' }
      );

      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          isVerified: user.isVerified,
          subscription: user.subscription,
          newsletterSubscribed: user.newsletterSubscribed
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in' });
    }
  }
);

// Verify email route
router.get('/verify/:token', async (req: express.Request, res: express.Response) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid verification token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying email' });
  }
});

export default router; 