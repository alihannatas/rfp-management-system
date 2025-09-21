import { Router } from 'express';
import { ProjectController } from '../controllers/projectController';
import { validate, validateQuery } from '../middleware/validation';
import { createProjectSchema, updateProjectSchema, paginationSchema } from '../utils/validation';
import { authenticateToken, requireCustomer } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);
router.use(requireCustomer);

// Project routes
router.post('/', validate(createProjectSchema), ProjectController.createProject);
router.get('/', validateQuery(paginationSchema), ProjectController.getProjects);
router.get('/dashboard', ProjectController.getDashboardData);
router.get('/:projectId', ProjectController.getProjectById);
router.put('/:projectId', validate(updateProjectSchema), ProjectController.updateProject);
router.delete('/:projectId', ProjectController.deleteProject);

export default router;
