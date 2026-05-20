import test from "node:test";
import assert from "node:assert/strict";
import { applyCalculatorInput, calculateExpression } from "./calculator.js";

test("calculates operator precedence and parentheses", () => {
  assert.equal(calculateExpression("2 + 3 * 4"), 14);
  assert.equal(calculateExpression("(2 + 3) * 4"), 20);
});

test("supports decimals and unary signs", () => {
  assert.equal(calculateExpression("-2.5 + 4"), 1.5);
  assert.equal(calculateExpression("3 * -2"), -6);
});

test("rejects invalid expressions", () => {
  assert.throws(() => calculateExpression("2 +"), /Invalid expression/);
  assert.throws(() => calculateExpression("2 / 0"), /Cannot divide by zero/);
  assert.throws(() => calculateExpression("alert(1)"), /Invalid character/);
});

test("builds expressions from calculator button presses", () => {
  let expression = "";
  for (const input of ["1", "2", "+", "3", "."]) {
    expression = applyCalculatorInput(expression, input);
  }

  assert.equal(expression, "12 + 3.");
  assert.equal(applyCalculatorInput(expression, "backspace"), "12 + 3");
  assert.equal(applyCalculatorInput(expression, "clear"), "");
});

test("replaces duplicate operators from button presses", () => {
  let expression = "";
  for (const input of ["8", "+", "*", "2"]) {
    expression = applyCalculatorInput(expression, input);
  }

  assert.equal(expression, "8 * 2");
});
