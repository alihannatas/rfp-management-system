import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { validate, validateQuery } from '../middleware/validation';
import { createProductSchema, paginationSchema } from '../utils/validation';
import { authenticateToken, requireCustomer } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);
router.use(requireCustomer);

// Product routes
router.post('/:projectId/products', validate(createProductSchema), ProductController.createProduct);
router.get('/:projectId/products', validateQuery(paginationSchema), ProductController.getProducts);
router.get('/:projectId/products/category', ProductController.getProductsByCategory);
router.get('/:projectId/products/:productId', ProductController.getProductById);
router.put('/:projectId/products/:productId', ProductController.updateProduct);
router.delete('/:projectId/products/:productId', ProductController.deleteProduct);

export default router;
