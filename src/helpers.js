const { readFile } = require('fs/promises');
const { ALARM, CHECK_MARK, DEFULT_FILENAME } = require('./constants');
const fs = require('fs');

const outputFile = process.env.INPUT_OUTPUTFILE ?? DEFULT_FILENAME;

exports.readJsonFile = async (filename) => {
  const file = await readFile(filename, 'utf-8');
  return JSON.parse(file);
};

exports.appendResultStr = async (data, newline = true) => {
  const cleanedData = data
    // eslint-disable-next-line no-control-regex
    .replace(/\x1B\[[0-9;]*[JKmsu]/g, '')
    .replace(/\s(>)\s*/g, '   ');
  let dataToAppend = cleanedData;
  if (newline) dataToAppend += '\n';
  fs.appendFileSync(outputFile ?? 'output.txt', dataToAppend, (err) => {
    if (err) {
      console.error('Error appending to file:', err);
      return;
    }
  });
};

exports.writeToOutputFile = (_fileName = outputFile) => {
  // name change?
  const fileName = _fileName;
  const appendResult = (data, newline = true) => {
    const cleanedData = data
      // eslint-disable-next-line no-control-regex
      .replace(/\x1B\[[0-9;]*[JKmsu]/g, '')
      .replace(/\s(>)\s*/g, '   ');
    let dataToAppend = cleanedData;
    if (newline) dataToAppend += '\n';
    fs.appendFileSync(fileName, dataToAppend, (err) => {
      if (err) {
        console.error('Error appending to file:', err);
        return;
      }
    });
  };

  return appendResult;
};

exports.reportFailures = (testResults) => {
  let failure_msg = '';
  testResults.forEach((resultObj) => {
    if (resultObj.status === 'failed') {
      failure_msg += resultObj.message;
    }
  });
  exports.appendResultStr(failure_msg);
};

exports.reportLowCoverage = (coverage, coverage_pct) => {
  for (const key in coverage) {
    if (Object.prototype.hasOwnProperty.call(coverage, key)) {
      const { lines, statements, functions, branches } = coverage[key];
      if (
        lines.pct < coverage_pct ||
        statements.pct < coverage_pct ||
        functions.pct < coverage_pct ||
        branches < coverage_pct
      ) {
        exports.appendResultStr(`Coverage for ${key}`);
        exports.appendResultStr(JSON.stringify(coverage[key], null, 2));
      }
    }
  }
};

exports.capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

exports.transposeTotals = (total) => {
  const rowKeys = Object.keys(total).filter((key) => key !== 'branchesTrue'); // do not want to include branchesTrue
  const colKeys = Object.keys(total[rowKeys[0]]);
  const formattedColKeys = colKeys.map((key, index) => {
    return `| ${[key]} ${index === colKeys.length - 1 ? '|' : ' '}`;
  });
  formattedColKeys.unshift('| ');

  const rows = [];
  rowKeys.forEach((header) => {
    const rowArr = colKeys.map((key, index) => {
      let specChar = null;
      if (key === 'pct') {
        specChar = parseInt(total[header][key]) < 100 ? ALARM : CHECK_MARK;
      }
      return `| ${specChar ?? ''}${total[header][key]} ${index === colKeys.length - 1 ? '|' : ' '}`;
    });
    rowArr.unshift(`| ${exports.capitalizeFirstLetter(header)} `);
    rows.push(rowArr);
  });

  exports.appendResultStr(formattedColKeys.join(''));
  exports.appendResultStr('| --- | --- | --- | --- | --- |');
  rows.forEach((row) => {
    exports.appendResultStr(row.join(''));
  });
};

exports.deleteFile = (filePath) => {
  try {
    fs.unlinkSync(filePath);
    console.log('File deleted successfully:', filePath);
  } catch (err) {
    console.error('Error deleting file:', err);
  }
};
