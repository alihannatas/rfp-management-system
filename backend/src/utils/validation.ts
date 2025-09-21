import Joi from 'joi';

// User validation schemas
export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  company: Joi.string().max(100).optional(),
  phone: Joi.string().max(20).optional(),
  role: Joi.string().valid('CUSTOMER', 'SUPPLIER').required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  company: Joi.string().max(100).optional(),
  phone: Joi.string().max(20).optional(),
});

// Project validation schemas
export const createProjectSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
  budget: Joi.number().positive().optional(),
});

export const updateProjectSchema = Joi.object({
  title: Joi.string().min(3).max(100).optional(),
  description: Joi.string().max(500).optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
  budget: Joi.number().positive().optional(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'COMPLETED', 'CANCELLED').optional(),
});

// Product validation schemas
export const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(500).optional(),
  category: Joi.string().valid(
    'ELECTRONICS',
    'SOFTWARE',
    'HARDWARE',
    'SERVICES',
    'CONSULTING',
    'MAINTENANCE',
    'OTHER'
  ).required(),
  unit: Joi.string().max(20).optional(),
});

// RFP validation schemas
export const createRFPSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).optional(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.number().integer().positive().required(),
      quantity: Joi.number().integer().positive().required(),
      notes: Joi.string().max(200).allow('').optional(),
    })
  ).min(1).required(),
});

export const updateRFPSchema = Joi.object({
  title: Joi.string().min(3).max(100).optional(),
  description: Joi.string().max(500).optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
  status: Joi.string().valid('DRAFT', 'ACTIVE', 'CLOSED', 'CANCELLED').optional(),
  isActive: Joi.boolean().optional(),
});

// Proposal validation schemas
export const createProposalSchema = Joi.object({
  rfpId: Joi.number().integer().positive().required(),
  items: Joi.array().items(
    Joi.object({
      rfpItemId: Joi.number().integer().positive().required(),
      unitPrice: Joi.number().positive().required(),
      notes: Joi.string().max(200).allow('').optional(),
    })
  ).min(1).required(),
  notes: Joi.string().max(500).allow('').optional(),
});

export const updateProposalSchema = Joi.object({
  status: Joi.string().valid('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN').optional(),
  items: Joi.array().items(
    Joi.object({
      rfpItemId: Joi.number().integer().positive().required(),
      unitPrice: Joi.number().positive().required(),
      notes: Joi.string().max(200).allow('').optional(),
    })
  ).min(1).optional(),
  notes: Joi.string().max(500).allow('').optional(),
});

// Pagination validation
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().max(100).allow('').optional(),
  sortBy: Joi.string().max(50).allow('').optional(),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

// Validation helper function
export const validateRequest = (schema: Joi.ObjectSchema, data: any) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  
  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    throw new Error(`Validation error: ${errorMessages.join(', ')}`);
  }
  
  return value;
};
