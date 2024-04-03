# generate-jest-reports
This action generates a test report and coverage report for projects utilizing jest for unit testing in javascript.
Make sure your project utilizing this action uses jest and has tests to create reports on.

The purpose of this is to help report on test results and testing coverage by outputting a text file. This text file can be utilized by other github actions to do other tasks such as, make PR comments, send to other developers, etc.
## How it works
In the steps of your yaml file using this action supply the action with path to the folder you want to check testing coverage on:
```yaml
- name: generate Jest reports
  uses: ShaneHoughton/generate-jest-reports@main
  with:
    coveragedir: "./functions"
    coveragepct: 100
    outputfile: "output.txt"
```
### Args:
1. `coveragedir`: the path to the directory you want to get a coverage summary for.
2. `coveragepct`: the percentage of coverage you desire for testing.
3. `outputfile`: the name of the file you wish to have outputted.

This action will run an npm command to generate test results and a coverage report inside of the runner container in github.
The two files that are created are:
1. test-results.json - the results of all found tests within your project.
    - If any of the tests **failed**, they **will** be included in the output text file.
2. coverage-summary.json - the coverage summary of the provided directory.
    - If any of the total coverage is **below** the entered coverage percent, it **will** be included in the output text file.
## Requirements
- This action will only work in a project that is utilizing jest and Javascript.
- Jest must be installed in your project and the test script in your project should have jest:
```json
"scripts": {
    "test": "jest",
    ...
}
```
- At this moment in time this project only supports Javascript and not Typescript.