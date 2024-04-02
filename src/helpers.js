const { readFile } = require('fs/promises');
const fs = require('fs');

exports.readJsonFile = async (filename) => {
  const file = await readFile(filename, 'utf-8');
  return JSON.parse(file);
};

exports.appendResultStr = async (data, newline = true) => {
  // eslint-disable-next-line no-control-regex
  const cleanedData = data.replace(/\x1B\[[0-9;]*[JKmsu]/g, '');
  let dataToAppend = cleanedData;
  if (newline) dataToAppend += '\n';
  fs.appendFileSync('output.txt', dataToAppend, (err) => {
    if (err) {
      console.error('Error appending to file:', err);
      return;
    }
    console.log('Data has been appended to file.');
  });
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
