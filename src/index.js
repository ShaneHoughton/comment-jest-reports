const TestReporter = require('../src/classes/TestReporter');

const outputFile = process.env.INPUT_OUTPUTFILE ?? 'output.md';
const coverageDir = process.env.INPUT_COVERAGEDIR ?? './src/**.js';
const coveragePct = process.env.INPUT_COVERAGEPCT ?? 80;
const branchesTrue = process.env.INPUT_BRANCHESTRUE ?? false;

const TR = new TestReporter(outputFile, coverageDir, coveragePct, branchesTrue);

TR.createReports();
