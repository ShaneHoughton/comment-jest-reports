const shell = require('shelljs');
const {
  readJsonFile,
  appendResultStr,
  reportFailures,
  reportLowCoverage,
} = require('./helpers');

const coverage_pct = 100;

const createSummary = async () => {
  try {
    shell.exec('npm i');
    shell.exec(`npm run test:results`);
    const results = await readJsonFile('./test-results.json');
    const coverage = await readJsonFile('./coverage-summary.json');

    if (results.numFailedTests === 0 && results.numFailedTestSuites === 0) {
      appendResultStr('================ All tests passed! ==================');
    } else {
      appendResultStr('============== Not all tests passed! ================');
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
      appendResultStr('============== Isufficient coverage! ===============');
      appendResultStr(`* Total coverage must meet at least ${coverage_pct}%`);
      appendResultStr(JSON.stringify(total, null, 2));
      reportLowCoverage(fnCoverages);
    }
  } catch (error) {
    console.error(error);
  }
};

createSummary();
