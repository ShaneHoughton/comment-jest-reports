# generate-jest-reports
This action generates a test report and coverage report for projects utilizing jest for unit testing in javascript.
Make sure your project utilizing this action uses jest and has tests to create reports on.
## How it works
In the steps of your yaml file using this action supply the action with path to the folder you want to check testing coverage on:
```yaml
- name: generate Jest reports
  uses: ShaneHoughton/generate-jest-reports@main
  with:
    coveragedir: "./functions"
```