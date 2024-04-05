const TestReporter = require('../src/classes/TestReporter');

describe('Test TestReporter methods', () => {
  test('TR is initialized', () => {
    const sut = TestReporter;
    const expectedFile = 'output.txt';
    const SUT = new sut(expectedFile);

    const actual = SUT.outputFile;

    expect(actual).toBe(expectedFile);
  });
});
