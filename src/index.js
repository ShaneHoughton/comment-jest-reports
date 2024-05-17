const TestReporter = require('../src/classes/TestReporter');

const outputFile = process.env.INPUT_OUTPUTFILE ?? 'output.md';
const coverageDir = process.env.INPUT_COVERAGEDIR ?? './**.js';
const coveragePct = parseInt(process.env.INPUT_COVERAGEPCT) ?? 80;
const branchesTrue = Boolean(process.env.INPUT_BRANCHESTRUE);

const TR = new TestReporter(outputFile, coverageDir, coveragePct, branchesTrue);

TR.createReports();
