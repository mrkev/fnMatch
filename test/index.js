let { match, func } = require('../src');

console.log(match, func);


match()(
  () => console.log('undefined'),
  (_) => console.log('anything'),
);


match(3)(
  () => console.log('undefined'),
  (_) => console.log('anything'),
);