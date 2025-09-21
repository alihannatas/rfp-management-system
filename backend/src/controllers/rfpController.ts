import { Request, Response } from 'express';
import { RFPService } from '../services/rfpService';
import { ResponseUtils } from '../utils/response';
import { AuthenticatedRequest, PaginationQuery } from '../types';

export class RFPController {
  static async createRFP(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const { projectId } = req.params;
      const rfp = await RFPService.createRFP(parseInt(projectId), req.body);
      ResponseUtils.success(res, rfp, 'RFP created successfully', 201);
    } catch (error) {
      ResponseUtils.error(res, (error as Error).message, 400);
    }
  }

  static async getRFPs(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const { projectId } = req.params;
      const pagination: PaginationQuery = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        search: req.query.search as string,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
      };

      const { rfps, total } = await RFPService.getRFPs(parseInt(projectId), pagination);
      
      const totalPages = Math.ceil(total / pagination.limit!);
      
      ResponseUtils.paginated(res, rfps, {
        page: pagination.page!,
        limit: pagination.limit!,
        total,
        totalPages,
      }, 'RFPs retrieved successfully');
    } catch (error) {
      ResponseUtils.error(res, (error as Error).message, 400);
    }
  }

  static async getRFPById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const { projectId, rfpId } = req.params;
      const rfp = await RFPService.getRFPById(parseInt(rfpId), parseInt(projectId));
      ResponseUtils.success(res, rfp, 'RFP retrieved successfully');
    } catch (error) {
      ResponseUtils.error(res, (error as Error).message, 404);
    }
  }

  static async updateRFP(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const { projectId, rfpId } = req.params;
      const rfp = await RFPService.updateRFP(parseInt(rfpId), parseInt(projectId), req.body);
      ResponseUtils.success(res, rfp, 'RFP updated successfully');
    } catch (error) {
      ResponseUtils.error(res, (error as Error).message, 400);
    }
  }

  static async deleteRFP(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const { projectId, rfpId } = req.params;
      await RFPService.deleteRFP(parseInt(rfpId), parseInt(projectId));
      ResponseUtils.success(res, null, 'RFP deleted successfully');
    } catch (error) {
      ResponseUtils.error(res, (error as Error).message, 404);
    }
  }

  static async toggleRFPStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const { projectId, rfpId } = req.params;
      const { isActive } = req.body;
      
      const rfp = await RFPService.toggleRFPStatus(parseInt(rfpId), parseInt(projectId), isActive);
      ResponseUtils.success(res, rfp, 'RFP status updated successfully');
    } catch (error) {
      ResponseUtils.error(res, (error as Error).message, 400);
    }
  }

  static async getActiveRFPs(req: Request, res: Response): Promise<void> {
    try {
      const rfps = await RFPService.getActiveRFPs();
      ResponseUtils.success(res, rfps, 'Active RFPs retrieved successfully');
    } catch (error) {
      ResponseUtils.error(res, (error as Error).message, 400);
    }
  }

  static async getRFPByIdForSupplier(req: Request, res: Response): Promise<void> {
    try {
      const { rfpId } = req.params;
      const rfp = await RFPService.getRFPByIdForSupplier(parseInt(rfpId));
      ResponseUtils.success(res, rfp, 'RFP retrieved successfully');
    } catch (error) {
      ResponseUtils.error(res, (error as Error).message, 400);
    }
  }

  static async getRFPComparison(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const { projectId } = req.params;
      const comparison = await RFPService.getRFPComparison(parseInt(projectId));
      ResponseUtils.success(res, comparison, 'RFP comparison retrieved successfully');
    } catch (error) {
      ResponseUtils.error(res, (error as Error).message, 400);
    }
  }
}
