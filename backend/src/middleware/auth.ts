import { Request, Response, NextFunction } from 'express';
import { JWTUtils } from '../utils/jwt';
import { ResponseUtils } from '../utils/response';
import { AuthenticatedRequest, JWTPayload } from '../types';

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      ResponseUtils.unauthorized(res, 'Access token is required');
      return;
    }

    const decoded = JWTUtils.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    ResponseUtils.unauthorized(res, 'Invalid or expired token');
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ResponseUtils.unauthorized(res, 'Authentication required');
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      ResponseUtils.forbidden(res, 'Insufficient permissions');
      return;
    }

    next();
  };
};

export const requireCustomer = requireRole(['CUSTOMER', 'ADMIN']);
export const requireSupplier = requireRole(['SUPPLIER', 'ADMIN']);
export const requireAdmin = requireRole(['ADMIN']);
