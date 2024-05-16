const fs = require('fs');
const TestReporter = require('../src/classes/TestReporter');
const mockTestCoverage = require('../src/mock/mock-coverage.json');
const mockFailedTestResults = require('../src/mock/mock-failed-test-results.json');

const deleteFile = (filePath) => {
  if (!fs.existsSync(filePath)) return;
  fs.unlinkSync(filePath, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
      return;
    }
    console.log('File deleted successfully');
  });
};

const deleteFiles = () => {
  const resultsFilePath = './test-results.json';
  const coverageFilePath = './coverage-summary.json';
  const outputFile = './output.md';
  deleteFile(resultsFilePath);
  deleteFile(coverageFilePath);
  deleteFile(outputFile);
};

describe('Test TestReporter methods', () => {
  afterEach(() => {
    deleteFiles();
  });

  const mockTableHeaders = ['total', 'covered', 'skipped', 'pct'];

  test('TR is initialized', () => {
    const sut = TestReporter;
    const expectedFile = 'output.txt';
    const expectedCoverageDir = './src/mock/failingTests/addFails.test.js';
    const SUT = new sut(expectedFile, expectedCoverageDir, true);

    const actualOutputFile = SUT.outputFile;
    const actualCoverageDir = SUT.defaultCoverageDir;

    expect(actualOutputFile).toBe(expectedFile);
    expect(actualCoverageDir).toBe(expectedCoverageDir);
  });

  test('TR generates jest files', async () => {
    const sut = TestReporter;
    const SUT = new sut(
      'output.md',
      './src/mock/passingTests/add.test.js',
      true,
    );

    const expectedResultsFilePath = './test-results.json';
    const expectedCoverageFilePath = './coverage-summary.json';

    SUT.createReports();

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const resultsFileExists = fs.existsSync(expectedResultsFilePath);
    const covereageFileExists = fs.existsSync(expectedCoverageFilePath);

    expect(covereageFileExists).toBe(true);
    expect(resultsFileExists).toBe(true);
  });

  test('TR writes to output file', async () => {
    const sut = TestReporter;
    const expectedFile = 'output.md';
    const expectedFileContent = 'this is a test. remain calm.';

    const SUT = new sut(
      expectedFile,
      './tests/mock/passingTests/add.test.js',
      true,
    );
    SUT.writeFile(expectedFileContent);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const actualOutputFile = SUT.outputFile;
    const actualFileContent = fs.readFileSync(`./${expectedFile}`, 'utf-8');

    expect(actualOutputFile).toBe(expectedFile);
    expect(actualFileContent).toBe(expectedFileContent);
  });

  test('TR creates table in output file', async () => {
    const sut = TestReporter;
    const expectedFile = 'output.md';
    const SUT = new sut(expectedFile, './src/mock/passingTests/add.test.js');
    const expectedFileContent = fs.readFileSync(
      `./src/mock/mockOutput.md`,
      'utf-8',
    );
    SUT.runCmd();
    SUT.addCoverageTable(mockTableHeaders, mockTestCoverage);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const generatedFileExists = fs.existsSync(`./${expectedFile}`);
    const actualFileContent = fs.readFileSync(`./${expectedFile}`, 'utf-8');

    expect(generatedFileExists).toBe(true);
    expect(expectedFileContent).toContain(actualFileContent);
  });

  test('TR adds failed tests to output file', async () => {
    const sut = TestReporter;
    const expectedFile = 'output.md';
    const SUT = new sut(
      expectedFile,
      './src/mock/failingTests/addFails.test.js',
    );
    const expecteFileContent = fs.readFileSync(
      `./src/mock/mockFailOutput.md`,
      'utf-8',
    );
    SUT.runCmd();
    SUT.addFailedTests(mockFailedTestResults);
    SUT.addCoverageTable(mockTableHeaders, mockTestCoverage);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const generatedFileExists = fs.existsSync(`./${expectedFile}`);
    const actualFileContent = fs.readFileSync(`./${expectedFile}`, 'utf-8');

    expect(generatedFileExists).toBe(true);
    expect(actualFileContent).toBe(expecteFileContent);
  });

  test('TR adds failed tests to output file for multiple test suites', async () => {
    const sut = TestReporter;
    const expectedFile = 'output.md';
    const SUT = new sut(expectedFile, './src/mock/failingTests/**.js');
    const expecteFileContent = fs.readFileSync(
      `./src/mock/mockFailOutput.md`,
      'utf-8',
    );
    SUT.runCmd();
    SUT.addFailedTests(mockFailedTestResults);
    SUT.addCoverageTable(mockTableHeaders, mockTestCoverage);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const generatedFileExists = fs.existsSync(`./${expectedFile}`);
    const actualFileContent = fs.readFileSync(`./${expectedFile}`, 'utf-8');

    expect(generatedFileExists).toBe(true);
    expect(actualFileContent).toBe(expecteFileContent);
  });

  test('TR createReport method creates files and report md', async () => {
    const sut = TestReporter;
    const expectedFile = 'output.md';
    const SUT = new sut(expectedFile, './src/mock/functions/**.js', 0);
    const expectedFileContent = fs.readFileSync(
      `./src/mock/mockOutput2.md`,
      'utf-8',
    );
    SUT.createReports();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const generatedFileExists = fs.existsSync(`./${expectedFile}`);
    const actualFileContent = fs.readFileSync(`./${expectedFile}`, 'utf-8');

    expect(generatedFileExists).toBe(true);
    expect(actualFileContent).toContain(expectedFileContent);
  });

  test('TR createReport method creates files and report md with branches true', async () => {
    const sut = TestReporter;
    const expectedFile = 'output.md';
    const SUT = new sut(expectedFile, './src/mock/functions/**.js', 0, true);
    const expectedFileContent = fs.readFileSync(
      `./src/mock/mockOutput3.md`,
      'utf-8',
    );
    SUT.createReports();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const generatedFileExists = fs.existsSync(`./${expectedFile}`);
    const actualFileContent = fs.readFileSync(`./${expectedFile}`, 'utf-8');

    expect(generatedFileExists).toBe(true);
    expect(actualFileContent).toContain(expectedFileContent);
  });
});
