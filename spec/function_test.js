const {
  match, func
} = require('../src');

const value = {
  name: 'Ajay',
  value: {
    x: 34,
  },
};

function destructNotes ({notes}) { return notes; }
let destructErrors = ({ errors }) => errors;
let destructResult = function ({result}) { return result; }

let getResult = func(
  destructNotes,
  destructErrors,
  destructResult
);

test('first contact', () => {
  expect(getResult({notes: "This works!"})).toBe("This works!");
});