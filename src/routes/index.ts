import { NextFunction, Request, Response, Router } from 'express';
import AppError from '../errors/AppError';

import transactionsRouter from './transactions.routes';

const routes = Router();

routes.use('/transactions', transactionsRouter);
routes.use(
  (err: Error, request: Request, response: Response, _: NextFunction) => {
    if (err instanceof AppError)
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });

    return response.status(500).json({
      status: 'error',
      message: err,
    });
  },
);

export default routes;
