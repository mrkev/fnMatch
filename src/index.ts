import { parseScript } from "cherow";
import { generate } from "astring";
import equal from "fast-deep-equal";
import type {
  AssignmentProperty,
  Node,
  Pattern,
  RestElement,
} from "cherow/dist/types/estree";

/**
 * TODO:
 * - Implement own function parser to replace cherow: just needs functions.
 * - Implement AST, value comparison to get rid of pretty-printer, eval
 */

const ast_equals_value = (a: Node, v: unknown): boolean => {
  let x;
  // I know I know. You're reading this so you care, I'll take
  // any correct PR implementing an AST to value comparison
  // function that doesn't use eval.
  eval("x = " + generate(a));
  return equal(v, x);
};

/********************************** Matchers **********************************/

/** ({x, y, z}) => ... */
const matchObjectPattern = (
  v: any,
  ps: (AssignmentProperty | RestElement)[],
) => {
  if (typeof v !== "object") return false;
  for (var i = 0; i < ps.length; i++) {
    const prop = ps[i];
    if (!v.hasOwnProperty((prop as any).key.name)) return false;
    if (!matches(v[(prop as any).key.name], (prop as any).value)) return false;
  }
  return true;
};

/** x => ... */
const matchIdentifier = (v: unknown, n: string) => true;

/** (x = 5) => ... */
const matchAssignmentPattern = (v: unknown, r: Node) => {
  return ast_equals_value(r, v);
};

/** ([h, h2, ...t]) => ... */
const matchArrayPattern = (v: any, e: Pattern[]) => {
  for (let i = 0; i < e.length; i++) {
    // there can only be one (last) RestElement by ES standards
    if (e[i].type === "RestElement") return true;
    if (i < v.length && matches(v[i], e[i])) continue;
    return false;
  }
  // no rest element? lengths must match
  return e.length === v.length;
};

/** () => ... */
const matchEmpty = (v: unknown, n: Node) => v === n; // always false?

/************************************ Main ************************************/

const matches = (v: unknown, n: Node) => {
  if (n === undefined) return matchEmpty(v, n);
  if (n.type === "Identifier") return matchIdentifier(v, n.name);
  if (n.type === "ObjectPattern") return matchObjectPattern(v, n.properties);
  if (n.type === "AssignmentPattern") {
    return matchAssignmentPattern(v, n.right);
  }
  if (n.type === "ArrayPattern") {
    return matchArrayPattern(v, n.elements as any);
  } else return false;
};

type ZeroCase = () => any;
type OneCase = (arg: any) => any;
type AnyCase = (arg: any) => any | (() => any);

type MatchResult<CS extends AnyCase[]> = [] extends Required<
  Parameters<CS[number]>
>
  ? ReturnType<CS[number]>
  : ReturnType<CS[number]> | undefined;

export function match<VL>(v: VL) {
  return <CS extends AnyCase[]>(...cases: CS): MatchResult<CS> => {
    const patterns = cases
      .map((pat) => pat.toString())
      .map((str) =>
        // Trick to make it work with anonymous functions
        !str.match(/function\s*\(/) ? str : `let x = ${str}`,
      )
      .map((str) => parseScript(str))
      .map(({ body: [node] }) => {
        let decl = null;
        switch (node.type) {
          case "ExpressionStatement":
            decl = (node.expression as any).params[0];
            break;
          case "FunctionDeclaration":
            decl = node.params[0];
            break;
          case "VariableDeclaration":
            decl = (node as any).declarations[0].init.params[0];
            break;
          default:
            throw new Error("Invalid pattern: " + node.type);
        }
        return decl;

        // const decl = (
        //   {
        //     // ArrowFunctionExpression: () => {}
        //     ExpressionStatement: ({ expression }) => expression.params[0],
        //     // function x () {}
        //     FunctionDeclaration: ({ params }) => params[0],
        //     // FunctionExpression: function () {} (from trick above)
        //     VariableDeclaration: ({ declarations }) =>
        //       declarations[0].init.params[0],
        //   } as { [key: string]: (node: Node) => void }
        // )[node.type];
        // if (!decl) throw new Error("Invalid pattern: " + node.type);
        // return decl(node);
      });

    for (let match = 0; match < patterns.length; match++) {
      if (matches(v, patterns[match])) {
        return cases[match](v as any);
      }
    }

    // Can we ensure exhaustiveness?
    return undefined as any;
  };
}

export function func<T extends AnyCase, CS extends AnyCase[] = T[]>(
  ...cases: CS
) {
  return <VL>(v: VL) => match(v)(...cases);
}

///////////////// WORKS.
/// if () => 2 ........ no undefined in return
/// if not ............... undefined in return

// type RetT<CS extends AnyCase[]> = [] extends Required<Parameters<CS[number]>>
//   ? [true, ReturnType<CS[number]>]
//   : [false, ReturnType<CS[number]> | undefined];

// declare function foo<CS extends AnyCase[]>(...args: CS): RetT<CS>;

// const a = foo(
//   (x = "foo") => 2,
//   // () => 2,
// );

// const x = [() => 2];
// type Y = Required<Parameters<(typeof x)[number]>>;

// type Foo = [] | [x: unknown];

// type X = [] extends Foo ? true : false;

// const b = match(2)(
//   // some object with name and age, where name is some x === "Ajay"
//   ({ name: x = "Ajay", age }) => {
//     return age < 18 ? "Hello young boi!" : "Hello boi!";
//   },

//   // some object with name and age, where name is some x === "Ajay"
//   ({ name, age }) => `Hello ${age} years old ${name}`,

//   // some array, where the first element is an object with
//   // name. Call name "n", call the rest of the array "rest".
//   ([{ name: n }, ...rest]) => {
//     return `Hello ${n}, and ${rest.length} others!`;
//   },

//   // some x equal to "hello"
//   (x = "Ajay") => "Hello boi!",

//   // some x
//   (x) => `Hello ${x}`,

//   () => "ello",
// );
