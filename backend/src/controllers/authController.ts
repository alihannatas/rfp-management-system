import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { ResponseUtils } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await AuthService.register(req.body);
      ResponseUtils.success(res, result, 'User registered successfully', 201);
    } catch (error) {
      ResponseUtils.error(res, (error as Error).message, 400);
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await AuthService.login(req.body);
      ResponseUtils.success(res, result, 'Login successful');
    } catch (error) {
      ResponseUtils.error(res, (error as Error).message, 401);
    }
  }

  static async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const user = await AuthService.getProfile(req.user.userId);
      ResponseUtils.success(res, user, 'Profile retrieved successfully');
    } catch (error) {
      ResponseUtils.error(res, (error as Error).message, 404);
    }
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const user = await AuthService.updateProfile(req.user.userId, req.body);
      ResponseUtils.success(res, user, 'Profile updated successfully');
    } catch (error) {
      ResponseUtils.error(res, (error as Error).message, 400);
    }
  }

  static async changePassword(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const { currentPassword, newPassword } = req.body;
      const result = await AuthService.changePassword(req.user.userId, currentPassword, newPassword);
      ResponseUtils.success(res, result, 'Password changed successfully');
    } catch (error) {
      ResponseUtils.error(res, (error as Error).message, 400);
    }
  }
}
