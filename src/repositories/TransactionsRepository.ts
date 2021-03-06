import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

export interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const incomeTransactions = transactions.filter(
      transaction => transaction.type === 'income',
    );

    const outcomeTransactions = transactions.filter(
      transaction => transaction.type === 'outcome',
    );

    const income = incomeTransactions.reduce(
      (result, transaction) => result + transaction.value,
      0,
    );

    const outcome = outcomeTransactions.reduce(
      (result, transaction) => result + transaction.value,
      0,
    );

    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;
