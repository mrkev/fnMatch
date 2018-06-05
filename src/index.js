const cherow = require('cherow');
const { generate } = require('astring');
const equal = require('fast-deep-equal');

/**
 * TODO:
 * - Implement own function parser to replace cherow: just needs functions.
 * - Implement AST, value comparison to get rid of pretty-printer, eval
 */

const ast_equals_value = (a, v) => {
  let x;
  // I know I know. You're reading this so you care, I'll take
  // any correct PR implementing an AST to value comparison
  // function that doesn't use eval.
  eval('x = ' + generate(a));
  return equal(v, x);
};


/********************************** Matchers **********************************/

/** ({x, y, z}) => ... */
const matchObjectPattern = (v, ps) => {
  if (typeof v !== 'object') return false;
  for (var i = 0; i < ps.length; i++) {
    const prop = ps[i];
    if (!v.hasOwnProperty(prop.key.name)) return false;
    if (!matches(v[prop.key.name], prop.value)) return false;
  }
  return true;
};

/** x => ... */
const matchIdentifier = () => true;

/** (x = 5) => ... */
const matchAssignmentPattern = (v, r) => {
  return ast_equals_value(r, v);
};

/** ([h, h2, ...t]) => ... */
const matchArrayPattern = (v, e) => {
  for (let i = 0; i < e.length; i++) {
    // there can only be one (last) RestElement by ES standards
    if (e[i].type === 'RestElement') return true;
    if (i < v.length) continue;
    return false;
  }
  // no rest element? lengths must match
  return e.length === v.length;
};

/** () => ... */
const matchEmpty = (v, n) => v === n;

/************************************ Main ************************************/

const matches = (v, n) => {
  if (n === undefined) return matchEmpty(v, n);
  if (n.type === 'Identifier') return matchIdentifier(v, n.name);
  if (n.type === 'ObjectPattern') return matchObjectPattern(v, n.properties);
  if (n.type === 'AssignmentPattern') {
    return matchAssignmentPattern(v, n.right);
  }
  if (n.type === 'ArrayPattern') {
    return matchArrayPattern(v, n.elements);
  }
  else return false;
};

const match = (v) => (...cases) => {
  const patterns = cases
    .map(pat => pat.toString())
    .map(str => cherow.parseScript(str))
    .map(ast => ast.body[0].expression.params[0]); // => ArrowFunctionExpression

  for (let match = 0; match < patterns.length; match++)
    if (matches(v, patterns[match]))
      return cases[match](v);

  return undefined;
};

const func = (...cases) => (v) => match(v)(...cases);

module.exports = { match, func };