import { Response } from 'express';
import { ApiResponse } from '../types';

export class ResponseUtils {
  static success<T>(
    res: Response,
    data?: T,
    message: string = 'Success',
    statusCode: number = 200
  ): void {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
    };
    res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string = 'Internal Server Error',
    statusCode: number = 500,
    error?: string
  ): void {
    const response: ApiResponse = {
      success: false,
      message,
      error,
    };
    res.status(statusCode).json(response);
  }

  static validationError(
    res: Response,
    message: string = 'Validation Error',
    errors?: string[]
  ): void {
    const response: ApiResponse = {
      success: false,
      message,
      error: errors?.join(', '),
    };
    res.status(400).json(response);
  }

  static unauthorized(
    res: Response,
    message: string = 'Unauthorized'
  ): void {
    const response: ApiResponse = {
      success: false,
      message,
    };
    res.status(401).json(response);
  }

  static forbidden(
    res: Response,
    message: string = 'Forbidden'
  ): void {
    const response: ApiResponse = {
      success: false,
      message,
    };
    res.status(403).json(response);
  }

  static notFound(
    res: Response,
    message: string = 'Not Found'
  ): void {
    const response: ApiResponse = {
      success: false,
      message,
    };
    res.status(404).json(response);
  }

  static conflict(
    res: Response,
    message: string = 'Conflict'
  ): void {
    const response: ApiResponse = {
      success: false,
      message,
    };
    res.status(409).json(response);
  }

  static paginated<T>(
    res: Response,
    data: T[],
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    },
    message: string = 'Success'
  ): void {
    const response: ApiResponse<T[]> = {
      success: true,
      message,
      data,
      pagination,
    };
    res.status(200).json(response);
  }
}
