import { Request, Response } from 'express';
import { ProductService } from '../services/productService';
import { ResponseUtils } from '../utils/response';
import { AuthenticatedRequest, PaginationQuery } from '../types';

export class ProductController {
  static async createProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const { projectId } = req.params;
      const product = await ProductService.createProduct(parseInt(projectId), req.body);
      ResponseUtils.success(res, product, 'Product created successfully', 201);
    } catch (error) {
      ResponseUtils.error(res, (error as Error).message, 400);
    }
  }

  static async getProducts(req: AuthenticatedRequest, res: Response): Promise<void> {
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

      const { products, total } = await ProductService.getProducts(parseInt(projectId), pagination);
      
      const totalPages = Math.ceil(total / pagination.limit!);
      
      ResponseUtils.paginated(res, products, {
        page: pagination.page!,
        limit: pagination.limit!,
        total,
        totalPages,
      }, 'Products retrieved successfully');
    } catch (error) {
      ResponseUtils.error(res, (error as Error).message, 400);
    }
  }

  static async getProductById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const { projectId, productId } = req.params;
      const product = await ProductService.getProductById(parseInt(productId), parseInt(projectId));
      ResponseUtils.success(res, product, 'Product retrieved successfully');
    } catch (error) {
      ResponseUtils.error(res, (error as Error).message, 404);
    }
  }

  static async updateProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const { projectId, productId } = req.params;
      const product = await ProductService.updateProduct(parseInt(productId), parseInt(projectId), req.body);
      ResponseUtils.success(res, product, 'Product updated successfully');
    } catch (error) {
      ResponseUtils.error(res, (error as Error).message, 400);
    }
  }

  static async deleteProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const { projectId, productId } = req.params;
      await ProductService.deleteProduct(parseInt(productId), parseInt(projectId));
      ResponseUtils.success(res, null, 'Product deleted successfully');
    } catch (error) {
      ResponseUtils.error(res, (error as Error).message, 404);
    }
  }

  static async getProductsByCategory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const { projectId } = req.params;
      const { category } = req.query;
      
      if (!category) {
        ResponseUtils.error(res, 'Category parameter is required', 400);
        return;
      }

      const products = await ProductService.getProductsByCategory(parseInt(projectId), category as string);
      ResponseUtils.success(res, products, 'Products retrieved successfully');
    } catch (error) {
      ResponseUtils.error(res, (error as Error).message, 400);
    }
  }
}
