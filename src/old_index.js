const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);
const {
  readJsonFile,
  appendResultStr,
  reportFailures,
  transposeTotals,
} = require('./helpers');
const { ALARM, CHECK_MARK } = require('./constants');

const coverageDir = process.env.INPUT_COVERAGEDIR ?? './src';
const coverage_pct = process.env.INPUT_COVERAGEPCT ?? 100;

const createSummary = async () => {
  try {
    try {
      await exec(
        `npm run test -- --coverage --json --outputFile=./test-results.json --collectCoverageFrom=${coverageDir}/**/*.js --coverageReporters=json-summary --coverageDirectory=./`,
      );
    } catch (error) {
      console.log(error);
    }
    const results = await readJsonFile('./test-results.json');
    const coverage = await readJsonFile('./coverage-summary.json');

    if (results.numFailedTests === 0 && results.numFailedTestSuites === 0) {
      appendResultStr(`## All tests passed!${CHECK_MARK}`);
    } else {
      appendResultStr(`## Not all tests passed!${ALARM}`);
      appendResultStr(
        `* Only ${results.numPassedTests}/${results.numTotalTests} tests passed.`,
      );
      appendResultStr('* The following issues were found:');
      reportFailures(results.testResults);
    }
    const { total } = coverage;
    const { lines, statements, functions, branches } = total;
    if (
      lines.pct < coverage_pct ||
      statements.pct < coverage_pct ||
      functions.pct < coverage_pct ||
      branches.pct < coverage_pct
    ) {
      appendResultStr(`## Insufficient Coverage!${ALARM}`);
      appendResultStr(`* Total coverage must meet at least ${coverage_pct}%\n`);
      transposeTotals(total);
    }
  } catch (error) {
    appendResultStr('## An issue was encountered!');

    if (error.errno === -2) {
      appendResultStr(`Could not find any tests!`);
    }

    appendResultStr(JSON.stringify(error));
  }
};

createSummary();
