import csvParse from 'csv-parse';
import fs from 'fs';

interface CsvReaderProps {
  filepath: string;
}

async function csvReader({ filepath }: CsvReaderProps): Promise<string[]> {
  const readCSVStream = fs.createReadStream(filepath);

  const parseStream = csvParse({
    from_line: 2,
    ltrim: true,
    rtrim: true,
  });

  const parseCSV = readCSVStream.pipe(parseStream);

  return new Promise(resolve => {
    const lines: string[] = [];

    parseCSV.on('data', line => lines.push(line));

    parseCSV.on('end', () => resolve(lines));
  });
}

export default csvReader;
