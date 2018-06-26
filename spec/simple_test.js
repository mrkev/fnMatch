const {func} = require('../src');


const simple = func(
  () => 'undefined',
  (_) => 'anything',
);

test('undefined', () => {
  expect(simple()).toBe('undefined');
});

test('anything', () => {
  expect(simple(3)).toBe('anything');
});

