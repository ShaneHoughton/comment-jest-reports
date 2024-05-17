const TestReporter = require('../src/classes/TestReporter');

const outputFile = process.env.INPUT_OUTPUTFILE;
const coverageDir = process.env.INPUT_COVERAGEDIR;
const coveragePct = process.env.INPUT_COVERAGEPCT;
const branchesTrue = process.env.INPUT_BRANCHESTRUE === 'true';

const TR = new TestReporter(outputFile, coverageDir, coveragePct, branchesTrue);

TR.createReports();
