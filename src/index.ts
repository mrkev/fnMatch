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
  ps: (AssignmentProperty | RestElement)[]
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

type AnyFunc = (...args: any[]) => any;

type ExtractReturnTypes<T extends ((...args: any[]) => any)[]> = [
  ...{
    [K in keyof T]: T[K] extends (...args: any[]) => infer R ? R : never;
  }
];

type MatchResult<T extends ((...args: any[]) => any)[]> =
  ExtractReturnTypes<T>[number];

export const match =
  <VL>(v: VL) =>
  <CS extends ((arg: any) => any)[]>(
    ...cases: CS
  ): MatchResult<typeof cases> | undefined => {
    const patterns = cases
      .map((pat) => pat.toString())
      .map((str) =>
        // Trick to make it work with anonymous functions
        !str.match(/function\s*\(/) ? str : `let x = ${str}`
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
        return cases[match](v);
      }
    }

    return undefined;
  };

export const func =
  <CS extends ((arg: any) => any)[]>(...cases: CS) =>
  <VL>(v: VL) =>
    match(v)(...cases);
