import { prisma } from '../config/database';
import { CreateProposalRequest, UpdateProposalRequest, ProposalWithRelations, PaginationQuery } from '../types';

export class ProposalService {
  static async createProposal(supplierId: number, proposalData: CreateProposalRequest): Promise<ProposalWithRelations> {
    // Check if RFP exists and is active
    const rfp = await prisma.rFP.findFirst({
      where: {
        id: proposalData.rfpId,
        status: 'ACTIVE',
        isActive: true,
        endDate: {
          gte: new Date(),
        },
      },
      include: {
        items: true,
      },
    });

    if (!rfp) {
      throw new Error('RFP not found or not available for proposals');
    }

    // Validate that all RFP items are included in the proposal
    const rfpItemIds = rfp.items.map(item => item.id);
    const proposalItemIds = proposalData.items.map(item => item.rfpItemId);
    
    const missingItems = rfpItemIds.filter(id => !proposalItemIds.includes(id));
    if (missingItems.length > 0) {
      throw new Error('All RFP items must be included in the proposal');
    }

    // Check if supplier already has a proposal for this RFP
    const existingProposal = await prisma.proposal.findFirst({
      where: {
        supplierId,
        rfpId: proposalData.rfpId,
      },
    });

    if (existingProposal) {
      throw new Error('You have already submitted a proposal for this RFP');
    }

    // Calculate total amount
    let totalAmount = 0;
    const proposalItems = proposalData.items.map(item => {
      const rfpItem = rfp.items.find(ri => ri.id === item.rfpItemId);
      if (!rfpItem) {
        throw new Error('Invalid RFP item');
      }
      
      const totalPrice = Number(item.unitPrice) * rfpItem.quantity;
      totalAmount += totalPrice;
      
      return {
        rfpItemId: item.rfpItemId,
        unitPrice: item.unitPrice,
        totalPrice,
        notes: item.notes,
      };
    });

    // Create proposal with items
    const proposal = await prisma.proposal.create({
      data: {
        supplierId,
        rfpId: proposalData.rfpId,
        totalAmount,
        notes: proposalData.notes,
        items: {
          create: proposalItems,
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
    });

    return proposal;
  }

  static async getProposals(
    supplierId: number,
    pagination: PaginationQuery
  ): Promise<{ proposals: ProposalWithRelations[]; total: number }> {
    const { page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
    const skip = (page - 1) * limit;

    const where = {
      supplierId,
      ...(search && {
        OR: [
          { rfp: { title: { contains: search, mode: 'insensitive' as const } } },
          { notes: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [proposals, total] = await Promise.all([
      prisma.proposal.findMany({
        where,
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
          rfp: {
            include: {
              project: true,
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
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.proposal.count({ where }),
    ]);

    return { proposals, total };
  }

  static async getProposalById(proposalId: number, supplierId: number): Promise<ProposalWithRelations> {
    const proposal = await prisma.proposal.findFirst({
      where: {
        id: proposalId,
        supplierId,
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
        rfp: {
          include: {
            project: true,
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
    });

    if (!proposal) {
      throw new Error('Proposal not found');
    }

    return proposal;
  }

  static async getProposalByIdForCustomer(proposalId: number, customerId: number): Promise<ProposalWithRelations> {
    const proposal = await prisma.proposal.findFirst({
      where: {
        id: proposalId,
        rfp: {
          project: {
            customerId,
          },
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
        rfp: {
          include: {
            project: true,
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
    });

    if (!proposal) {
      throw new Error('Proposal not found');
    }

    return proposal;
  }

  static async updateProposal(
    proposalId: number,
    supplierId: number,
    updateData: UpdateProposalRequest
  ): Promise<ProposalWithRelations> {
    // Check if proposal exists and belongs to supplier
    const existingProposal = await prisma.proposal.findFirst({
      where: {
        id: proposalId,
        supplierId,
        status: 'PENDING',
      },
    });

    if (!existingProposal) {
      throw new Error('Proposal not found or cannot be updated');
    }

    let updatePayload: any = {
      notes: updateData.notes,
    };

    // If items are being updated, recalculate total amount
    if (updateData.items) {
      const rfp = await prisma.rFP.findUnique({
        where: { id: existingProposal.rfpId },
        include: { items: true },
      });

      if (!rfp) {
        throw new Error('RFP not found');
      }

      let totalAmount = 0;
      const proposalItems = updateData.items.map(item => {
        const rfpItem = rfp.items.find(ri => ri.id === item.rfpItemId);
        if (!rfpItem) {
          throw new Error('Invalid RFP item');
        }
        
        const totalPrice = Number(item.unitPrice) * rfpItem.quantity;
        totalAmount += totalPrice;
        
        return {
          rfpItemId: item.rfpItemId,
          unitPrice: item.unitPrice,
          totalPrice,
          notes: item.notes,
        };
      });

      updatePayload.totalAmount = totalAmount;

      // Update proposal items
      await prisma.proposalItem.deleteMany({
        where: { proposalId },
      });

      await prisma.proposalItem.createMany({
        data: proposalItems.map(item => ({
          proposalId,
          ...item,
        })),
      });
    }

    const proposal = await prisma.proposal.update({
      where: { id: proposalId },
      data: updatePayload,
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
        rfp: {
          include: {
            project: true,
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
    });

    return proposal;
  }

  static async updateProposalStatus(
    proposalId: number,
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN'
  ): Promise<ProposalWithRelations> {
    const proposal = await prisma.proposal.update({
      where: { id: proposalId },
      data: { status },
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
        rfp: {
          include: {
            project: true,
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
    });

    return proposal;
  }

  static async getProposalsByRFP(rfpId: number): Promise<ProposalWithRelations[]> {
    const proposals = await prisma.proposal.findMany({
      where: { rfpId },
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
        rfp: {
          include: {
            project: true,
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
      orderBy: { submittedAt: 'desc' },
    });

    return proposals;
  }

  static async withdrawProposal(proposalId: number, supplierId: number): Promise<void> {
    const proposal = await prisma.proposal.findFirst({
      where: {
        id: proposalId,
        supplierId,
        status: 'PENDING',
      },
    });

    if (!proposal) {
      throw new Error('Proposal not found or cannot be withdrawn');
    }

    await prisma.proposal.update({
      where: { id: proposalId },
      data: { status: 'WITHDRAWN' },
    });
  }

  static async updateProposalStatusByCustomer(proposalId: number, customerId: number, status: 'ACCEPTED' | 'REJECTED'): Promise<ProposalWithRelations> {
    const proposal = await prisma.proposal.findFirst({
      where: {
        id: proposalId,
        rfp: {
          project: {
            customerId,
          },
        },
        status: 'PENDING',
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
        rfp: {
          include: {
            project: true,
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
    });

    if (!proposal) {
      throw new Error('Proposal not found or cannot be updated');
    }

    const updatedProposal = await prisma.proposal.update({
      where: { id: proposalId },
      data: { status },
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
        rfp: {
          include: {
            project: true,
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
    });

    return updatedProposal;
  }
}
