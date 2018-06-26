const {
  match, func
} = require('./index');

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

console.log(getResult({notes: "This works!"}))
