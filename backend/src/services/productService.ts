import { prisma } from '../config/database';
import { CreateProductRequest, PaginationQuery } from '../types';

export class ProductService {
  static async createProduct(projectId: number, productData: CreateProductRequest) {
    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const product = await prisma.product.create({
      data: {
        ...productData,
        projectId,
      },
    });

    return product;
  }

  static async getProducts(
    projectId: number,
    pagination: PaginationQuery
  ): Promise<{ products: any[]; total: number }> {
    const { page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
    const skip = (page - 1) * limit;

    const where = {
      projectId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total };
  }

  static async getProductById(productId: number, projectId: number) {
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        projectId,
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  static async updateProduct(
    productId: number,
    projectId: number,
    updateData: Partial<CreateProductRequest>
  ) {
    // Check if product exists and belongs to project
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        projectId,
      },
    });

    if (!existingProduct) {
      throw new Error('Product not found');
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    return product;
  }

  static async deleteProduct(productId: number, projectId: number): Promise<void> {
    // Check if product exists and belongs to project
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        projectId,
      },
    });

    if (!existingProduct) {
      throw new Error('Product not found');
    }

    await prisma.product.delete({
      where: { id: productId },
    });
  }

  static async getProductsByCategory(projectId: number, category: string) {
    const products = await prisma.product.findMany({
      where: {
        projectId,
        category: category as any,
      },
      orderBy: { name: 'asc' },
    });

    return products;
  }
}
