const { addNumbers } = require('../add');

describe('Test mock function', () => {
  test('Add two numbers again', () => {
    const sut = addNumbers;
    const expected = 4;

    const actual = sut('2', '2');

    expect(actual).toBe(expected);
  });
});
