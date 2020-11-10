import {
  getCustomRepository,
  getRepository,
  TransactionRepository,
} from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';

import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

/**
 * Não pode criar transaction de saída sem saldo suficiente
 * Verificar se a categoria existe, criar uma em caso negativo
 */

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    if (type === 'outcome') {
      const { total } = await transactionsRepository.getBalance();

      if (value < 0) throw new AppError('Value must be a positive number', 400);

      if (total < value) throw new AppError('Insufficient balance', 400);
    }

    const categoriesRepository = getRepository(Category);

    const newCategory =
      (await categoriesRepository.findOne({
        title: category,
      })) ||
      categoriesRepository.create({
        title: category,
      });

    await categoriesRepository.save(newCategory);

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: newCategory.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
