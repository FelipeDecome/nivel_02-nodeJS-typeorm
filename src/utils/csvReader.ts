import csvParse from 'csv-parse';
import fs from 'fs';

interface CsvReaderProps {
  filepath: string;
}

interface CSVTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

async function csvReader({
  filepath,
}: CsvReaderProps): Promise<CSVTransaction[]> {
  const readCSVStream = fs.createReadStream(filepath);

  const parseStream = csvParse({
    from_line: 2,
    ltrim: true,
    rtrim: true,
  });

  const parseCSV = readCSVStream.pipe(parseStream);

  return new Promise(resolve => {
    const transactionsProps: CSVTransaction[] = [];

    parseCSV.on('data', line => {
      const [title, type, value, category] = line;

      transactionsProps.push({
        title,
        type,
        value: Number(value),
        category,
      });
    });

    parseCSV.on('end', () => resolve(transactionsProps));
  });
}

export default csvReader;
