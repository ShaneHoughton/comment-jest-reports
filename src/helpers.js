import { readFile } from 'fs/promises';
import fs from 'fs';

export const readJsonFile = async (filename) => {
  const file = await readFile(filename, 'utf-8');
  return JSON.parse(file);
}

export const appendResultStr = async (data, newline = true) => {
  let dataToAppend = data;
  if (newline) dataToAppend += '\n';
  fs.appendFileSync('output.txt', dataToAppend, (err) => {
    if (err) {
      console.error('Error appending to file:', err);
      return;
    }
    console.log('Data has been appended to file.');
  });
}

export const reportFailures = (testResults) => {
  let failure_msg = '';
  testResults.forEach((resultObj) => {
    if (resultObj.status === 'failed') {
      failure_msg += resultObj.message;
    }
  })
  appendResultStr(failure_msg);
}

export const reportLowCoverage = (coverage, coverage_pct) => {
  for (const key in coverage) {
    if (coverage.hasOwnProperty(key)) {
      const { lines, statements, functions, branches } = coverage[key];
      if (
        lines.pct < coverage_pct ||
        statements.pct < coverage_pct ||
        functions.pct < coverage_pct ||
        branches < coverage_pct
        ) {
          appendResultStr(`Coverage for ${key}`);
          appendResultStr(JSON.stringify(coverage[key], null, 2));
        }
    }
}
}