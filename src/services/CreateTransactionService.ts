import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

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
    const transactionRepository = new TransactionsRepository();
    if (type === 'outcome') {
      const balance = await transactionRepository.getBalance();
    }
  }
}

export default CreateTransactionService;
