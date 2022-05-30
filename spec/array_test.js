const { func } = require("../src");

let arrayFunc = func(
  ([a, b, c]) => `${a}, ${b}, ${c}`,
  ([a, b, ...c]) => `${a}, ${b} [${c}]`,
  ([a, b]) => `${a}, ${b}`,
  ([a, ...b]) => `${a} [${b}]`,
  ([]) => "[]"
);

test("ARRAY_TEST_1", () => {
  expect(arrayFunc([0, 2, 3, 4, 5])).toBe("0, 2 [3,4,5]");
});

test("ARRAY_TEST_2", () => {
  expect(arrayFunc([0, 2, 3, 4])).toBe("0, 2 [3,4]");
});

test("ARRAY_TEST_3", () => {
  expect(arrayFunc([0, 2, 3])).toBe("0, 2, 3");
});

test("ARRAY_TEST_4", () => {
  expect(arrayFunc([0, 2])).toBe("0, 2 []");
});

test("ARRAY_TEST_5", () => {
  expect(arrayFunc([0])).toBe("0 []");
});

test("ARRAY_TEST_6", () => {
  expect(arrayFunc([])).toBe("[]");
});

test("nothing", () => {
  const nothing = func(([x, ...y]) => console.log(x, y))([]);
  expect(nothing).toBe(undefined);
});
