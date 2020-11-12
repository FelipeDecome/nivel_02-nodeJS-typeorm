import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import { promisify } from 'util';
import fs from 'fs';
import multer from 'multer';
import uploadConfig from '../config/upload';

import CreateTransactionService from '../services/CreateTransactionService';

import TransactionsRepository from '../repositories/TransactionsRepository';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepository.find();
  const balance = await transactionsRepository.getBalance();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransactionService = new CreateTransactionService();

  const transaction = await createTransactionService.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransactionService = new DeleteTransactionService();

  await deleteTransactionService.execute({ id });

  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('csvFile'),
  async (request, response) => {
    try {
      const { path } = request.file;

      const importTransactionsService = new ImportTransactionsService();

      const transactions = await importTransactionsService.execute({
        filepath: path,
      });

      await fs.promises.unlink(path);

      return response.json(transactions);
    } catch (err) {
      return response.status(400).json(err);
    }
  },
);

export default transactionsRouter;
