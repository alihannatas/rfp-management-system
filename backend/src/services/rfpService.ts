import { prisma } from '../config/database';
import { CreateRFPRequest, UpdateRFPRequest, RFPWithRelations, PaginationQuery } from '../types';

export class RFPService {
  static async createRFP(projectId: number, rfpData: CreateRFPRequest): Promise<RFPWithRelations> {
    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    // Validate that all products belong to the project
    const productIds = rfpData.items.map(item => parseInt(item.productId.toString()));
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        projectId,
      },
    });

    if (products.length !== productIds.length) {
      throw new Error('Some products do not belong to this project');
    }

    // Create RFP with items
    const rfp = await prisma.rFP.create({
      data: {
        title: rfpData.title,
        description: rfpData.description,
        status: 'ACTIVE',
        startDate: new Date(rfpData.startDate),
        endDate: new Date(rfpData.endDate),
        projectId,
        items: {
          create: rfpData.items.map(item => ({
            productId: parseInt(item.productId.toString()),
            quantity: item.quantity,
            notes: item.notes,
          })),
        },
      },
      include: {
        project: true,
        items: {
          include: {
            product: true,
          },
        },
        proposals: true,
      },
    });

    return rfp;
  }

  static async getRFPs(
    projectId: number,
    pagination: PaginationQuery
  ): Promise<{ rfps: RFPWithRelations[]; total: number }> {
    const { page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
    const skip = (page - 1) * limit;

    const where = {
      projectId,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [rfps, total] = await Promise.all([
      prisma.rFP.findMany({
        where,
        include: {
          project: true,
          items: {
            include: {
              product: true,
            },
          },
          proposals: true,
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.rFP.count({ where }),
    ]);

    return { rfps, total };
  }

  static async getRFPById(rfpId: number, projectId: number): Promise<RFPWithRelations> {
    const rfp = await prisma.rFP.findFirst({
      where: {
        id: rfpId,
        projectId,
      },
      include: {
        project: true,
        items: {
          include: {
            product: true,
          },
        },
        proposals: {
          include: {
            supplier: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                company: true,
                phone: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
              },
            },
            items: {
              include: {
                rfpItem: {
                  include: {
                    product: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!rfp) {
      throw new Error('RFP not found');
    }

    return rfp;
  }

  static async updateRFP(
    rfpId: number,
    projectId: number,
    updateData: UpdateRFPRequest
  ): Promise<RFPWithRelations> {
    // Check if RFP exists and belongs to project
    const existingRFP = await prisma.rFP.findFirst({
      where: {
        id: rfpId,
        projectId,
      },
    });

    if (!existingRFP) {
      throw new Error('RFP not found');
    }

    const rfp = await prisma.rFP.update({
      where: { id: rfpId },
      data: {
        ...updateData,
        startDate: updateData.startDate ? new Date(updateData.startDate) : undefined,
        endDate: updateData.endDate ? new Date(updateData.endDate) : undefined,
      },
      include: {
        project: true,
        items: {
          include: {
            product: true,
          },
        },
        proposals: true,
      },
    });

    return rfp;
  }

  static async deleteRFP(rfpId: number, projectId: number): Promise<void> {
    // Check if RFP exists and belongs to project
    const existingRFP = await prisma.rFP.findFirst({
      where: {
        id: rfpId,
        projectId,
      },
    });

    if (!existingRFP) {
      throw new Error('RFP not found');
    }

    await prisma.rFP.delete({
      where: { id: rfpId },
    });
  }

  static async toggleRFPStatus(rfpId: number, projectId: number, isActive: boolean): Promise<RFPWithRelations> {
    // Check if RFP exists and belongs to project
    const existingRFP = await prisma.rFP.findFirst({
      where: {
        id: rfpId,
        projectId,
      },
    });

    if (!existingRFP) {
      throw new Error('RFP not found');
    }

    const rfp = await prisma.rFP.update({
      where: { id: rfpId },
      data: { isActive },
      include: {
        project: true,
        items: {
          include: {
            product: true,
          },
        },
        proposals: true,
      },
    });

    return rfp;
  }

  static async getActiveRFPs(): Promise<RFPWithRelations[]> {
    const rfps = await prisma.rFP.findMany({
      where: {
        status: 'ACTIVE',
        isActive: true,
        endDate: {
          gte: new Date(),
        },
      },
      include: {
        project: {
          include: {
            customer: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                company: true,
                phone: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
        items: {
          include: {
            product: true,
          },
        },
        proposals: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return rfps;
  }

  static async getRFPComparison(projectId: number) {
    const rfps = await prisma.rFP.findMany({
      where: { projectId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        proposals: {
          include: {
            supplier: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                company: true,
                phone: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
              },
            },
            items: {
              include: {
                rfpItem: {
                  include: {
                    product: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return rfps;
  }

  static async getRFPByIdForSupplier(rfpId: number): Promise<RFPWithRelations> {
    const rfp = await prisma.rFP.findFirst({
      where: {
        id: rfpId,
        status: 'ACTIVE',
        isActive: true,
        endDate: {
          gte: new Date(),
        },
      },
      include: {
        project: {
          include: {
            customer: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                company: true,
                phone: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
        items: {
          include: {
            product: true,
          },
        },
        proposals: true,
      },
    });

    if (!rfp) {
      throw new Error('RFP not found or not accessible');
    }

    return rfp;
  }
}
