import { match } from "./index";

type Person = {
  name: string;
  age?: number;
  props?: {
    x: number;
  };
};

const value: Person = {
  name: "Ajay",
  props: {
    x: 34,
  },
};

/**
 * First an example then explanations. Each pattern has a
 * brief explanation of what it matches.
 */

const result = match(value)(
  // some object with name and age, where name is some x === "Ajay"
  ({ name: x = "Ajay", age }) => {
    return age < 18 ? "Hello young boi!" : "Hello boi!";
  },

  // some object with name and age, where name is some x === "Ajay"
  ({ name, age }) => `Hello ${age} years old ${name}`,

  // some array, where the first element is an object with
  // name. Call name "n", call the rest of the array "rest".
  ([{ name: n }, ...rest]) => {
    return `Hello ${n}, and ${rest.length} others!`;
  },

  // some x equal to "hello"
  (x = "Ajay") => "Hello boi!",

  // some x
  (x) => `Hello ${x}`
);

console.log(result);

/**
 * You can also import "func", which essentially a shortcut for this
 * very common pattern:
 *
 *    let f = (value) => match(value)(...)
 *
 * The above is equivalent to;
 *
 *    let f = func(...)
 */

import { func } from "./index";

const format = func(
  (x = 42) => "the answer",
  (x = 10) => "diez",
  (x = 5) => "one hand",
  () => "some number"
);

[...Array(20).keys()].map((n) => console.log(format(n)));

console.log(
  match({ members: [1, 2, 3, 4] })(
    ({ members: { list: x } }) => console.log("doesn't match"),
    ({ members: [x, ...rest] }) => console.log(x, rest)
  )
);
