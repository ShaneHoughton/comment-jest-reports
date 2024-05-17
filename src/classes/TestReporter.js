const fs = require('fs');
const { execSync } = require('child_process');
const { ALARM, CHECK_MARK } = require('../constants');

class TestReporter {
  constructor(
    outputFile = 'output.md',
    coverageDir = './src',
    coverage_percent = 80,
    branchesTrue = false,
  ) {
    this._outputFile = outputFile;
    this._coverage_percent = coverage_percent;
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

  get coverage_percent() {
    return this._coverage_percent;
  }

  set coverage_percent(percentage) {
    this._coverage_percent = percentage;
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
          itemData.push(
            `${pct < this._coverage_percent ? ALARM : CHECK_MARK}${pct}`,
          );
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
      console.log('executing!');
      return result.toString();
    } catch (error) {
      console.error(
        'Error:',
        error.stderr ? error.stderr.toString() : error.toString(),
      );
    }
  }

  readJSON(filePath) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(data);

      return jsonData;
    } catch (err) {
      console.error('Error reading or parsing the file', err);
      return null;
    }
  }

  createReports() {
    // generate json files
    this.runCmd();
    const testResults = this.readJSON('./test-results.json');
    const coverageReport = this.readJSON('./coverage-summary.json');
    if (testResults && coverageReport) {
      this.addFailedTests(testResults);
      this.addCoverageTable(
        ['total', 'covered', 'skipped', 'pct'],
        coverageReport,
      );
    }
  }
}
module.exports = TestReporter;
