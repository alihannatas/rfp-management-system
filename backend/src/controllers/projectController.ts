import { Request, Response } from 'express';
import { ProjectService } from '../services/projectService';
import { ResponseUtils } from '../utils/response';
import { AuthenticatedRequest, PaginationQuery } from '../types';

export class ProjectController {
  static async createProject(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const project = await ProjectService.createProject(req.user.userId, req.body);
      ResponseUtils.success(res, project, 'Project created successfully', 201);
    } catch (error) {
      ResponseUtils.error(res, (error as Error).message, 400);
    }
  }

  static async getProjects(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const pagination: PaginationQuery = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        search: req.query.search as string,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
      };

      const { projects, total } = await ProjectService.getProjects(req.user.userId, pagination);
      
      const totalPages = Math.ceil(total / pagination.limit!);
      
      ResponseUtils.paginated(res, projects, {
        page: pagination.page!,
        limit: pagination.limit!,
        total,
        totalPages,
      }, 'Projects retrieved successfully');
    } catch (error) {
      ResponseUtils.error(res, (error as Error).message, 400);
    }
  }

  static async getProjectById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const { projectId } = req.params;
      const project = await ProjectService.getProjectById(parseInt(projectId), req.user.userId);
      ResponseUtils.success(res, project, 'Project retrieved successfully');
    } catch (error) {
      ResponseUtils.error(res, (error as Error).message, 404);
    }
  }

  static async updateProject(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const { projectId } = req.params;
      const project = await ProjectService.updateProject(parseInt(projectId), req.user.userId, req.body);
      ResponseUtils.success(res, project, 'Project updated successfully');
    } catch (error) {
      ResponseUtils.error(res, (error as Error).message, 400);
    }
  }

  static async deleteProject(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const { projectId } = req.params;
      await ProjectService.deleteProject(parseInt(projectId), req.user.userId);
      ResponseUtils.success(res, null, 'Project deleted successfully');
    } catch (error) {
      ResponseUtils.error(res, (error as Error).message, 404);
    }
  }

  static async getDashboardData(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const dashboardData = await ProjectService.getDashboardData(req.user.userId);
      ResponseUtils.success(res, dashboardData, 'Dashboard data retrieved successfully');
    } catch (error) {
      ResponseUtils.error(res, (error as Error).message, 400);
    }
  }
}
