import { getCustomRepository, getRepository, In } from 'typeorm';
import csvReader from '../utils/csvReader';

import AppError from '../errors/AppError';

import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  filepath: string;
}

class ImportTransactionsService {
  async execute({ filepath }: Request): Promise<Transaction[]> {
    const importedTransactions = await csvReader({ filepath });

    const categoriesRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const csvCategories: string[] = [];

    importedTransactions.forEach(transactionProps => {
      const { category } = transactionProps;

      if (!csvCategories.includes(category)) {
        csvCategories.push(category);
      }
    });

    const finalBalanceTransactions = importedTransactions.reduce(
      (result, transaction) => {
        if (transaction.type === 'income') {
          return result + transaction.value;
        }
        return result - transaction.value;
      },
      0,
    );

    const actualBalance = await transactionsRepository.getBalance();

    if (
      finalBalanceTransactions < 0 &&
      actualBalance.total + finalBalanceTransactions < 0
    )
      throw new AppError('Insufficient Balance');

    const existentCategories = await categoriesRepository.find({
      where: { title: In(csvCategories) },
    });

    const existentCategoriesTitles = existentCategories.map(
      category => category.title,
    );

    const categoriesToBeCreated = csvCategories.filter(
      category => !existentCategoriesTitles.includes(category),
    );

    const newCategories = categoriesToBeCreated.map(category => {
      return categoriesRepository.create({ title: category });
    });

    await categoriesRepository.save(newCategories);

    const categories = existentCategories.concat(newCategories);

    const transactions = importedTransactions.map(transaction => {
      const { title, type, value, category } = transaction;

      const categoryObject = categories.find(cat => cat.title === category);

      const category_id = categoryObject?.id;

      if (!category_id)
        throw new AppError('There`s something wrong, call an administrator');

      return transactionsRepository.create({
        title,
        type,
        value,
        category_id,
      });
    });

    await transactionsRepository.save(transactions);

    return transactions;
  }
}

export default ImportTransactionsService;
