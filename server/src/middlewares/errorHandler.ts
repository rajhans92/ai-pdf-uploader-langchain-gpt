import { Request, Response, NextFunction } from "express";

class ErrorHandler {

  static error(
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';

    // Log the error stack trace in development
    if (process.env.NODE_ENV === 'dev') {
        console.error(error.stack);
    }

    // Return a standardized error response
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
    });

  }
}

export default ErrorHandler;