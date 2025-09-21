import { Router } from 'express';
import { ProposalController } from '../controllers/proposalController';
import { validate, validateQuery } from '../middleware/validation';
import { createProposalSchema, updateProposalSchema, paginationSchema } from '../utils/validation';
import { authenticateToken, requireSupplier, requireCustomer } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Supplier routes
router.post('/', requireSupplier, validate(createProposalSchema), ProposalController.createProposal);
router.get('/', requireSupplier, validateQuery(paginationSchema), ProposalController.getProposals);
router.get('/:proposalId', requireSupplier, ProposalController.getProposalById);
router.put('/:proposalId', requireSupplier, validate(updateProposalSchema), ProposalController.updateProposal);
router.put('/:proposalId/withdraw', requireSupplier, ProposalController.withdrawProposal);

// Customer routes
router.get('/customer/:proposalId', requireCustomer, ProposalController.getProposalByIdForCustomer);
router.put('/customer/:proposalId/status', requireCustomer, ProposalController.updateProposalStatusByCustomer);

// Public routes for viewing proposals
router.get('/rfp/:rfpId', ProposalController.getProposalsByRFP);
router.put('/:proposalId/status', ProposalController.updateProposalStatus);

export default router;
