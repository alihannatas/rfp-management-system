import { prisma } from '../config/database';
import { CreateProjectRequest, UpdateProjectRequest, ProjectWithRelations, PaginationQuery } from '../types';

export class ProjectService {
  static async createProject(customerId: number, projectData: CreateProjectRequest): Promise<ProjectWithRelations> {
    const project = await prisma.project.create({
      data: {
        ...projectData,
        customerId,
        startDate: projectData.startDate ? new Date(projectData.startDate) : null,
        endDate: projectData.endDate ? new Date(projectData.endDate) : null,
        budget: projectData.budget ? projectData.budget : null,
      },
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
        rfps: true,
        products: true,
      },
    });

    return project;
  }

  static async getProjects(
    customerId: number,
    pagination: PaginationQuery
  ): Promise<{ projects: ProjectWithRelations[]; total: number }> {
    const { page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
    const skip = (page - 1) * limit;

    const where = {
      customerId,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
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
          rfps: true,
          products: true,
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.project.count({ where }),
    ]);

    return { projects, total };
  }

  static async getProjectById(projectId: number, customerId: number): Promise<ProjectWithRelations> {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        customerId,
      },
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
        rfps: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
            proposals: true,
          },
        },
        products: true,
      },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    return project;
  }

  static async updateProject(
    projectId: number,
    customerId: number,
    updateData: UpdateProjectRequest
  ): Promise<ProjectWithRelations> {
    // Check if project exists and belongs to customer
    const existingProject = await prisma.project.findFirst({
      where: {
        id: projectId,
        customerId,
      },
    });

    if (!existingProject) {
      throw new Error('Project not found');
    }

    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        ...updateData,
        startDate: updateData.startDate ? new Date(updateData.startDate) : undefined,
        endDate: updateData.endDate ? new Date(updateData.endDate) : undefined,
      },
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
        rfps: true,
        products: true,
      },
    });

    return project;
  }

  static async deleteProject(projectId: number, customerId: number): Promise<void> {
    // Check if project exists and belongs to customer
    const existingProject = await prisma.project.findFirst({
      where: {
        id: projectId,
        customerId,
      },
    });

    if (!existingProject) {
      throw new Error('Project not found');
    }

    await prisma.project.delete({
      where: { id: projectId },
    });
  }

  static async getDashboardData(customerId: number) {
    const [
      totalProjects,
      activeProjects,
      totalRFPs,
      activeRFPs,
      totalProposals,
      pendingProposals,
      recentProjects,
      recentRFPs,
      recentProposals,
    ] = await Promise.all([
      prisma.project.count({ where: { customerId } }),
      prisma.project.count({ where: { customerId, status: 'ACTIVE' } }),
      prisma.rFP.count({
        where: {
          project: { customerId },
        },
      }),
      prisma.rFP.count({
        where: {
          project: { customerId },
          status: 'ACTIVE',
        },
      }),
      prisma.proposal.count({
        where: {
          rfp: {
            project: { customerId },
          },
        },
      }),
      prisma.proposal.count({
        where: {
          rfp: {
            project: { customerId },
          },
          status: 'PENDING',
        },
      }),
      prisma.project.findMany({
        where: { customerId },
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
          rfps: true,
          products: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.rFP.findMany({
        where: {
          project: { customerId },
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
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.proposal.findMany({
        where: {
          rfp: {
            project: { customerId },
          },
        },
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
          rfp: true,
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
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    return {
      totalProjects,
      activeProjects,
      totalRFPs,
      activeRFPs,
      totalProposals,
      pendingProposals,
      recentProjects,
      recentRFPs,
      recentProposals,
    };
  }
}
