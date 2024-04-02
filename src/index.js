const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);
const {
  readJsonFile,
  appendResultStr,
  reportFailures,
  reportLowCoverage,
} = require('./helpers');

const coverageDir = process.env.INPUT_COVERAGEDIR;

const coverage_pct = 100;

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
      appendResultStr(
        '=============================== All tests passed! =======================================',
      );
    } else {
      appendResultStr(
        '=============================== Not all tests passed! ===================================',
      );
      appendResultStr(
        `* Only ${results.numPassedTests}/${results.numTotalTests} tests passed.`,
      );
      appendResultStr('* The following issues were found:');
      reportFailures(results.testResults);
    }
    const { total, ...fnCoverages } = coverage;
    const { lines, statements, functions, branches } = total;
    if (
      lines.pct < coverage_pct ||
      statements.pct < coverage_pct ||
      functions.pct < coverage_pct ||
      branches.pct < coverage_pct
    ) {
      appendResultStr(
        '============================== Insufficient Coverage! ===================================',
      );
      appendResultStr(`* Total coverage must meet at least ${coverage_pct}%`);
      appendResultStr(JSON.stringify(total, null, 2));
      reportLowCoverage(fnCoverages);
    }
  } catch (error) {
    appendResultStr(
      '============================= An issue was encountered! =================================',
    );

    if (error.errno === -2) {
      appendResultStr(`Could not find any tests!`);
    }

    appendResultStr(JSON.stringify(error));
  }
};

createSummary();
