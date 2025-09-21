import { Request, Response } from 'express';
import { ProposalService } from '../services/proposalService';
import { ResponseUtils } from '../utils/response';
import { AuthenticatedRequest, PaginationQuery } from '../types';

export class ProposalController {
  static async createProposal(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const proposal = await ProposalService.createProposal(req.user.userId, req.body);
      ResponseUtils.success(res, proposal, 'Proposal created successfully', 201);
    } catch (error) {
      ResponseUtils.error(res, (error as Error).message, 400);
    }
  }

  static async getProposals(req: AuthenticatedRequest, res: Response): Promise<void> {
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

      const { proposals, total } = await ProposalService.getProposals(req.user.userId, pagination);
      
      const totalPages = Math.ceil(total / pagination.limit!);
      
      ResponseUtils.paginated(res, proposals, {
        page: pagination.page!,
        limit: pagination.limit!,
        total,
        totalPages,
      }, 'Proposals retrieved successfully');
    } catch (error) {
      ResponseUtils.error(res, (error as Error).message, 400);
    }
  }

  static async getProposalById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const { proposalId } = req.params;
      const proposal = await ProposalService.getProposalById(parseInt(proposalId), req.user.userId);
      ResponseUtils.success(res, proposal, 'Proposal retrieved successfully');
    } catch (error) {
      ResponseUtils.error(res, (error as Error).message, 404);
    }
  }

  static async getProposalByIdForCustomer(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const { proposalId } = req.params;
      const proposal = await ProposalService.getProposalByIdForCustomer(parseInt(proposalId), req.user.userId);
      ResponseUtils.success(res, proposal, 'Proposal retrieved successfully');
    } catch (error) {
      ResponseUtils.error(res, (error as Error).message, 404);
    }
  }

  static async updateProposal(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const { proposalId } = req.params;
      const proposal = await ProposalService.updateProposal(parseInt(proposalId), req.user.userId, req.body);
      ResponseUtils.success(res, proposal, 'Proposal updated successfully');
    } catch (error) {
      ResponseUtils.error(res, (error as Error).message, 400);
    }
  }

  static async updateProposalStatus(req: Request, res: Response): Promise<void> {
    try {
      const { proposalId } = req.params;
      const { status } = req.body;
      
      const proposal = await ProposalService.updateProposalStatus(parseInt(proposalId), status);
      ResponseUtils.success(res, proposal, 'Proposal status updated successfully');
    } catch (error) {
      ResponseUtils.error(res, (error as Error).message, 400);
    }
  }

  static async updateProposalStatusByCustomer(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const { proposalId } = req.params;
      const { status } = req.body;
      
      const proposal = await ProposalService.updateProposalStatusByCustomer(parseInt(proposalId), req.user.userId, status);
      ResponseUtils.success(res, proposal, 'Proposal status updated successfully');
    } catch (error) {
      ResponseUtils.error(res, (error as Error).message, 400);
    }
  }

  static async getProposalsByRFP(req: Request, res: Response): Promise<void> {
    try {
      const { rfpId } = req.params;
      const proposals = await ProposalService.getProposalsByRFP(parseInt(rfpId));
      ResponseUtils.success(res, proposals, 'Proposals retrieved successfully');
    } catch (error) {
      ResponseUtils.error(res, (error as Error).message, 400);
    }
  }

  static async withdrawProposal(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtils.unauthorized(res);
        return;
      }

      const { proposalId } = req.params;
      await ProposalService.withdrawProposal(parseInt(proposalId), req.user.userId);
      ResponseUtils.success(res, null, 'Proposal withdrawn successfully');
    } catch (error) {
      ResponseUtils.error(res, (error as Error).message, 400);
    }
  }
}
