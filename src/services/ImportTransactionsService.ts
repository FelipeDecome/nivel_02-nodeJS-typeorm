import path from 'path';
import csvReader from '../utils/csvReader';

import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  async execute(): Promise<Transaction[]> {
    const csvFilePath = path.resolve(
      __dirname,
      '..',
      '__tests__',
      'import_template.csv',
    );

    const lines = await csvReader({ filepath: csvFilePath });

    const createTransactionService = new CreateTransactionService();

    const transactions = lines.map(line => {
      return createTransactionService.execute({
        title: line[0],
        value: line[1],
        type: line[2],
        category: line[3],
      });
    });
  }
}

export default ImportTransactionsService;
