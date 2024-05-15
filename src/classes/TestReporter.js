const fs = require('fs');
const { execSync } = require('child_process');
const { ALARM, CHECK_MARK } = require('../constants');

class TestReporter {
  constructor(outputFile, coverageDir = './src', branchesTrue = false) {
    this._outputFile = outputFile;
    this._defaultCoverageDir = coverageDir;
    this._branchesTrue = branchesTrue;
  }

  // Getter and setter methods
  get outputFile() {
    return this._outputFile;
  }

  set outputFile(newName) {
    // You can add validation logic here
    this._outputFile = newName;
  }

  get defaultCoverageDir() {
    return this._defaultCoverageDir;
  }

  set defaultCoverageDir(newName) {
    this._defaultCoverageDir = newName;
  }

  // Methods
  writeFile(content) {
    fs.appendFileSync(this._outputFile, content, (err) => {
      if (err) {
        console.error('Error appending to file:', err);
        return;
      }
    });
  }

  addCoverageTable(headers, jsonCoverage) {
    const capitalize = (_str) => {
      return _str.charAt(0).toUpperCase() + _str.slice(1);
    };
    const coverageItems = [
      'lines',
      'statements',
      'functions',
      'branches',
      'branchesTrue',
    ];
    if (!this._branchesTrue) coverageItems.pop();
    const rows = [];
    rows.push(`||${headers.join('|')}|\n`);
    rows.push(`|${'-|'.repeat(headers.length + 1)}\n`);

    coverageItems.forEach((item) => {
      let itemData = [];
      const data = jsonCoverage.total[item];
      headers.forEach((header) => {
        if (header === 'pct') {
          const pct = data[header];
          itemData.push(`${pct < 100 ? ALARM : CHECK_MARK}${pct}`);
          return;
        }
        itemData.push(data[header]);
      });
      rows.push(`|${capitalize(item)}|${itemData.join('|')}|\n`);
    });

    this.writeFile('## Total Coverage\n');
    rows.forEach((row) => {
      this.writeFile(row);
    });
  }

  addFailedTests(testResultsJson) {
    const { success, testResults } = testResultsJson;
    if (success) {
      this.writeFile('## All tests passed!\n');
      return;
    }

    this.writeFile('## Not all tests passed!\n');
    testResults.forEach((result) => {
      this.writeFile(result.message);
    });
    // console.log(testResults);
    // return '';
  }

  runCmd() {
    let cmd = 'npm test --';
    cmd += ' --silent';
    cmd += ` --findRelatedTests ${this.defaultCoverageDir}`;
    cmd += ' --json --outputFile=./test-results.json';
    cmd += ' --coverage';
    cmd += ` --collectCoverageFrom=${this.defaultCoverageDir}`;
    cmd += ' --coverageReporters=json-summary';
    cmd += ' --coverageDirectory=./';
    // `npx jest --collectCoverageFrom=${coverageDir}/**/*.js --coverage --json --outputFile=./test-results.json --coverageReporters=json-summary --coverageDirectory=./`,
    try {
      const result = execSync(cmd);
      return result.toString();
    } catch (error) {
      console.error(
        'Error:',
        error.stderr ? error.stderr.toString() : error.toString(),
      );
    }
  }

  createReports() {
    // generate json files
    this.runCmd();
  }
}
module.exports = TestReporter;
