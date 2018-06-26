const {
  func,
} = require('../src');

let arr = func(
  ([a, b, c]) => `${a}, ${b}, ${c}`,
  ([a, b, ...c]) => `${a}, ${b} [${c}]`,
  ([a, b]) => `${a}, ${b}`,
  ([a, ...b]) => `${a} [${b}]`,
  ([]) => '[]'
);

test('TEST1', () => {
  expect(arr([0, 2, 3, 4, 5])).toBe('0, 2 [3,4,5]');
});

test('TEST2', () => {
  expect(arr([0, 2, 3, 4])).toBe('0, 2 [3,4]');
});

test('TEST3', () => {
  expect(arr([0, 2, 3])).toBe('0, 2, 3');
});

test('TEST4', () => {
  expect(arr([0, 2])).toBe('0, 2 []');
});

test('TEST5', () => {
  expect(arr([0])).toBe('0 []');
});

test('TEST6', () => {
  expect(arr([])).toBe('[]');
});

test('nothing', () => {
  const nothing = func(([x, ...y]) => console.log(x, y))([]);
  expect(nothing).toBe(undefined);
});
