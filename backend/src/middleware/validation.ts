import { Request, Response, NextFunction } from 'express';
import { validateRequest } from '../utils/validation';
import { ResponseUtils } from '../utils/response';

export const validate = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = validateRequest(schema, req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      ResponseUtils.validationError(res, (error as Error).message);
    }
  };
};

export const validateQuery = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = validateRequest(schema, req.query);
      req.query = validatedData;
      next();
    } catch (error) {
      ResponseUtils.validationError(res, (error as Error).message);
    }
  };
};
