import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key');
    const user = await User.findOne({ _id: (decoded as any)._id });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate.' });
  }
};

export const requireVerified = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user.isVerified) {
    return res.status(403).json({ message: 'Please verify your email first.' });
  }
  next();
};

export const requireSubscription = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user.subscription === 'none') {
    return res.status(403).json({ message: 'Please subscribe to access this feature.' });
  }
  next();
}; 