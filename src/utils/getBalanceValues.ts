import Transaction from '../models/Transaction';
import { Balance } from '../repositories/TransactionsRepository';

interface GetBalanceValuesProps {
  transactions: Transaction[];
}

export default async function getBalanceValues({
  transactions,
}: GetBalanceValuesProps): Promise<Balance> {
  const income = transactions
    .filter(transaction => transaction.type === 'income')
    .reduce((result, transaction) => result + transaction.value, 0);

  const outcome = transactions
    .filter(transaction => transaction.type === 'outcome')
    .reduce((result, transaction) => result + transaction.value, 0);

  const total = income - outcome;

  return {
    income,
    outcome,
    total,
  };
}
