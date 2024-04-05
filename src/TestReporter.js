const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

class TestReporter {
  constructor(_outputFile) {
    this.outputFile = _outputFile;
  }

  // Getter and setter methods
  get outputFile() {
    return this._outputFile;
  }

  set outputFile(newName) {
    // You can add validation logic here
    this._outputFile = newName;
  }

  // Methods
  createReports() {
    return 'in progress';
  }
}
module.exports = TestReporter;
