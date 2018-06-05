# fnMatch

This is a very simple implementation of pattern matching using no syntax extensions. That means you can use it without a transpiler; just include it on your project/website.

Instead of extending the language, it just uses functions. That's it.

It supports:

- Shape matching through **object deconstruction**:

```javascript
let group = {
  class: "CS 3410",
  members: [
    {name: "Ajay", age: 22},
    {name: "Seung", age: 23},
    {name: "Adi", age: 22},
  ],
}

match(x)(
  ({ club, members }) => {}, // doesn't match, missing "club"
  ({ class, members: [first, ...rest]}) => {}, // matches!
  ({ class, members }) => {}, // would match if previous didn't
)
```

- Value matching through **default values**:

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

Ocaml:

```ocaml
let rec fib = function
  | 0 -> 1
  | 1 -> 1
  | x -> (fib x-2) + (fib x-1)
```

JavaScript:

```javascript
let fib = func(
  (_ = 0) => 1
  (_ = 1) => 1
  (x) => (fib x-2) + (fib x-1)
);
```

- And of course, these are **expressions** "match" and "func" are expressions evaluating to the return the value of the matched function, so this will work for example:

```javascript

const process_response = func(
  ({ status: s = 200, data: d = null }) => Error("Data is null"),
  ({ status: s = 200, data: d = []}) => Error("Data is empty"),
  ({ status: s = 200, data: d }) => d,
  ({ errors: [h, ...t] }) =>
    Error(`Non-empty errors. ${t.length + 1} total.`),
  ({ status }) =>
    Error(`Status ${status}, no errors reported`)
  () =>
    Error("Invalid response")
)

const print_response = response => {
  const result = process_response(response)
  if (result instanceof Error) throw result;
  console.log(`Recieved ${result}!`)
}
```

Here it's worth noting that patterns are tested in order, from top to bottom.

### Array semantics

For the sake of usability, the semantics used for array matching are different from how calling a function with that destructs an array would have you believe. Let's illustrate with 2 examples:

- Identifiers will always match a value in the array, whereas on function calls they are assigned `undefined` if there's nothing for them to match

```javascript

// Javascrpt
(([x, ...y]) => console.log(x, y))([]) // logs "undefined []"

// fn-match
func(([x, ...y]) => console.log(x, y))([])   // logs nothing, doesn't match
```

- Patterns without a "rest clause" (ie, `...t`) will only match patterns of that same length (similar to how Ocaml works)

```javascript

// Javascrpt
(([x, y]) => console.log(x, y))([1, 2, 3]) // logs "1 2"

// fn-match
func(([x, y]) => console.log(x, y))([1, 2, 3])   // logs nothing, doesn't match
```


### Disclaimer

This was very quickly thrown together, so it's very much not optimized in any way. See the source for details on maybe not low-hanging, but definitley juicy performance improvements that could be made.

Happy matching!