<p align="center">
<img width=250 src="https://github.com/mrkev/fnMatch/raw/master/docs/img/cheesy_logo.png">
</p>

# fnMatch

This is a very simple implementation of pattern matching using **no syntax extensions**. That means you can use it **without a transpiler**; just include it on your project/website.

## Quick example:

You can do this in **OCaml**:

```ocaml
let rec fib n = match n with
  | 0 -> 1
  | 1 -> 1
  | x -> fib (x-2) + fib (x-1)
```

**JavaScript** using fnMatch:

```javascript
let fib = (n) => match(n)(
  (x = 0) => 1,
  (x = 1) => 1,
  (x) => fib(x-2) + fib(x-1)
);
```


## Installation

- node

```
npm i fnMatch
```

- web

```
<script src="https://raw.githubusercontent.com/mrkev/fnMatch/master/dist/fnMatch.js"></script>
```

## Usage

Instead of extending the language, it just uses **_functions_**. That's it. Just import `fnMatch` anywhere:

```javascript
const { match, func } = require('fnMatch');
```

It supports:

- Shape matching through **object deconstruction**:

```javascript

let group = {
  course: "CS 3410",
  members: [
    {name: "Ajay", age: 22},
    {name: "Seung", age: 23},
    {name: "Adi", age: 22},
  ],
}

match(group)(
  ({ club, members }) => {}, // doesn't match, missing "club"
  ({ course, members: [first, ...rest]}) => {}, // matches!
  ({ course, members }) => {}, // would match if previous didn't
)
```

- Value matching through **default value syntax**:

```javascript

match("hello")(
  (_ = "hey") => {}, // doesn't match
  (_ = "world") => {}, // doesn't match
  (_ = "hello") => {}, // matches!
)

```

- **Binding** (of course, these are _functions_ after all!)

```javascript

match({name: "Ajay"})(
  ({name}) => conosle.log(`Hello ${name}!`), // matches, name is "Ajay"
  () => console.log("Hello, someone!"), // would match if previous didn't
)

```

- Alternative syntax: **pattern definition before evaluation**:

```javascript

func(
  ({name}) => conosle.log(`Hello ${name}!`), // matches, name is "Ajay"
  () => console.log("Hello, someone!"), // would match if previous didn't
)({name: "Ajay"})

```

Woah woah woah. Why would I want to do a pattern match by defining the patterns first and passing in the value later? Well, because this is an expression, and this way of doing things is useful for defining functions, _a la_ OCaml's `function` keyword:

OCaml:

```ocaml
let rec fib = function
  | 0 -> 1
  | 1 -> 1
  | x -> fib (x-2) + fib (x-1)
```

JavaScript:

```javascript
let fib = func(
  (_ = 0) => 1
  (_ = 1) => 1
  (x) => fib(x-2) + fib(x-1)
);
```

- And of course, "match" and "func" are **expressions** evaluating to the return the value of the matched function. Here's a more complex example:

```javascript

const process_response = func(
  ({ status: s = 200, data: d = null }) => Error("Data is null"),
  ({ status: s = 200, data: d = []}) => Error("Data is empty"),
  ({ status: s = 200, data }) => data, // return data
  ({ errors: [h, ...t] }) => Error(`Non-empty errors. ${t.length + 1} total.`),
  ({ status }) => Error(`Status ${status}, no errors reported`),
  (_) => Error("Invalid response"),
)

const print_response = response => {
  const result = process_response(response)
  if (result instanceof Error) throw result;
  console.log(`Recieved ${result}!`)
}
```

## Things to note

- **Patterns are tested in order**, from top to bottom:

```javascript

// This prints "default"
match({ name: "Ajay" })(
  (_) => console.log("default"),
  ({name}) => console.log(name),
)

// This prints "Ajay"
match({ name: "Ajay" })(
  ({name}) => console.log(name),
  (_) => console.log("default"),
)

```

- `() => {}` matches **_undefined_**, not **_all_** (aka, `() => {}` !== `(_) => {}`):

```javascript

// This prints "undefined"
match()(
  () => console.log('undefined'),
  (_) => console.log('anything'),
);

// This prints "anything"
match(3)(
  () => console.log('undefined'),
  (_) => console.log('anything'),
);

```

- **Array semantics** are a little different from how JavaScript normally works:


### Array semantics

For the sake of usability, the semantics used for array matching are different from how calling a function with that destructs an array would have you believe. Let's illustrate with 2 examples:

- Identifiers will always match a value in the array, whereas on function calls they are assigned `undefined` if there's nothing for them to match

```javascript

// Javascrpt
(([x, ...y]) => console.log(x, y))([]) // logs "undefined []"

// fnMatch
func(([x, ...y]) => console.log(x, y))([])   // logs nothing, doesn't match
```

- Patterns without a "rest clause" (ie, `...t`) will only match patterns of that same length (similar to how Ocaml works)

```javascript

// Javascrpt
(([x, y]) => console.log(x, y))([1, 2, 3]) // logs "1 2"

// fnMatch
func(([x, y]) => console.log(x, y))([1, 2, 3])   // logs nothing, doesn't match
```


### Disclaimer

This was very quickly thrown together, so it's very much not optimized in any way. See the source for details on maybe not low-hanging, but definitley juicy performance improvements that could be made.

Happy matching!

--------------

[![Build Status](https://travis-ci.org/mrkev/fnMatch.svg?branch=master)](https://travis-ci.org/mrkev/fnMatch)
[![Coverage Status](https://coveralls.io/repos/github/mrkev/fnMatch/badge.svg?branch=master)](https://coveralls.io/github/mrkev/fnMatch?branch=master)
