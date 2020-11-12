import { getCustomRepository, getRepository } from 'typeorm';
import csvReader from '../utils/csvReader';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  filepath: string;
}

/**
 * Ler arquivo CSV;
 * Verificar as categorias à serem criadas se existem no banco e adicionar em um array as que ainda não existem;
 * Verificar se os valores da Transação estão OK;
 * Criar as transações e armazenar em um array;
 * Criar as Categorias salvar o id delas;
 * Criar as Transações com os ids salvos;
 * Inserir as Categorias no banco;
 * Inserir as Transações no banco;
 * Retornar o Array das transações inseridas;
 */

class ImportTransactionsService {
  async execute({ filepath }: Request): Promise<void> {
    const csvData = await csvReader({ filepath });

    const categoryRepository = getRepository(Category);

    // const importedTransactions = [];
    const categoriesToBeInsertOnDatabase = [];

    csvData.map(async line => {
      const [title, type, value, category] = line.split(',');

      console.log(line);

      if (!title || !type || !value)
        throw new AppError('Wrong structure on the imported csv file');

      const categoryExists = await categoryRepository.findOne({
        title: category,
      });

      if (!categoryExists) categoriesToBeInsertOnDatabase.push(category);
      throw new AppError('Teste');
    });
  }
}

export default ImportTransactionsService;
