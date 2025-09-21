import { Router } from 'express';
import { RFPController } from '../controllers/rfpController';
import { validate, validateQuery } from '../middleware/validation';
import { createRFPSchema, updateRFPSchema, paginationSchema } from '../utils/validation';
import { authenticateToken, requireCustomer, requireSupplier } from '../middleware/auth';

const router = Router();

// All routes require authentication and customer role
router.use(authenticateToken);
router.use(requireCustomer);

// RFP routes
router.post('/:projectId/rfps', validate(createRFPSchema), RFPController.createRFP);
router.get('/:projectId/rfps', validateQuery(paginationSchema), RFPController.getRFPs);
router.get('/:projectId/rfps/comparison', RFPController.getRFPComparison);
router.get('/:projectId/rfps/:rfpId', RFPController.getRFPById);
router.put('/:projectId/rfps/:rfpId', validate(updateRFPSchema), RFPController.updateRFP);
router.put('/:projectId/rfps/:rfpId/toggle', RFPController.toggleRFPStatus);
router.delete('/:projectId/rfps/:rfpId', RFPController.deleteRFP);

// Public routes for suppliers (no authentication required) - must be after specific routes
router.get('/active', RFPController.getActiveRFPs);
router.get('/:rfpId', RFPController.getRFPByIdForSupplier);

export default router;
