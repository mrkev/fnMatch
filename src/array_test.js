const {
  func,
} = require('./index');

let test = func(
  ([a, b, c]) => `${a}, ${b}, ${c}`,
  ([a, b, ...c]) => `${a}, ${b} [${c}]`,
  ([a, b]) => `${a}, ${b}`,
  ([a, ...b]) => `${a} [${b}]`,
  ([]) => '[]',
);

console.log(test([0, 2, 3, 4, 5])); // 1
console.log(test([0, 2, 3, 4])); // 1
console.log(test([0, 2, 3])); // 1
console.log(test([0, 2])); // 2
console.log(test([0])); // 4
console.log(test([])); // 5

// no pattern matches here
const nothing = func(([x, ...y]) => console.log(x, y))([]);
console.log(nothing);