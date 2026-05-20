const OPERATORS = {
  "+": { precedence: 1, apply: (a, b) => a + b },
  "-": { precedence: 1, apply: (a, b) => a - b },
  "*": { precedence: 2, apply: (a, b) => a * b },
  "/": {
    precedence: 2,
    apply: (a, b) => {
      if (b === 0) {
        throw new Error("Cannot divide by zero");
      }
      return a / b;
    },
  },
};

const isOperator = (value) => Object.prototype.hasOwnProperty.call(OPERATORS, value);

const tokenize = (expression) => {
  const tokens = [];
  let index = 0;
  let expectsNumber = true;

  while (index < expression.length) {
    const char = expression[index];

    if (/\s/.test(char)) {
      index += 1;
      continue;
    }

    if (/[0-9.]/.test(char) || ((char === "-" || char === "+") && expectsNumber)) {
      let numberText = "";

      if ((char === "-" || char === "+") && expectsNumber) {
        numberText += char;
        index += 1;
      }

      while (index < expression.length && /[0-9.]/.test(expression[index])) {
        numberText += expression[index];
        index += 1;
      }

      if (!/^[-+]?(?:\d+\.?\d*|\.\d+)$/.test(numberText)) {
        throw new Error("Invalid expression");
      }

      tokens.push({ type: "number", value: Number(numberText) });
      expectsNumber = false;
      continue;
    }

    if (isOperator(char)) {
      if (expectsNumber) {
        throw new Error("Invalid expression");
      }
      tokens.push({ type: "operator", value: char });
      expectsNumber = true;
      index += 1;
      continue;
    }

    if (char === "(") {
      tokens.push({ type: "leftParen", value: char });
      expectsNumber = true;
      index += 1;
      continue;
    }

    if (char === ")") {
      tokens.push({ type: "rightParen", value: char });
      expectsNumber = false;
      index += 1;
      continue;
    }

    throw new Error("Invalid character");
  }

  return tokens;
};

const toRpn = (tokens) => {
  const output = [];
  const operators = [];

  for (const token of tokens) {
    if (token.type === "number") {
      output.push(token);
      continue;
    }

    if (token.type === "operator") {
      while (
        operators.length > 0 &&
        operators[operators.length - 1].type === "operator" &&
        OPERATORS[operators[operators.length - 1].value].precedence >=
          OPERATORS[token.value].precedence
      ) {
        output.push(operators.pop());
      }
      operators.push(token);
      continue;
    }

    if (token.type === "leftParen") {
      operators.push(token);
      continue;
    }

    if (token.type === "rightParen") {
      while (
        operators.length > 0 &&
        operators[operators.length - 1].type !== "leftParen"
      ) {
        output.push(operators.pop());
      }

      if (operators.length === 0) {
        throw new Error("Invalid expression");
      }

      operators.pop();
    }
  }

  while (operators.length > 0) {
    const operator = operators.pop();
    if (operator.type === "leftParen") {
      throw new Error("Invalid expression");
    }
    output.push(operator);
  }

  return output;
};

export const calculateExpression = (expression) => {
  const tokens = tokenize(expression);

  if (tokens.length === 0) {
    throw new Error("Invalid expression");
  }

  const stack = [];

  for (const token of toRpn(tokens)) {
    if (token.type === "number") {
      stack.push(token.value);
      continue;
    }

    const right = stack.pop();
    const left = stack.pop();

    if (left === undefined || right === undefined) {
      throw new Error("Invalid expression");
    }

    stack.push(OPERATORS[token.value].apply(left, right));
  }

  if (stack.length !== 1 || !Number.isFinite(stack[0])) {
    throw new Error("Invalid expression");
  }

  return stack[0];
};

export const formatCalculationResult = (result) => {
  return Number.isInteger(result) ? String(result) : String(Number(result.toFixed(10)));
};

export const applyCalculatorInput = (expression, input) => {
  if (input === "clear") {
    return "";
  }

  if (input === "backspace") {
    return expression.trimEnd().slice(0, -1).trimEnd();
  }

  if (/^\d$/.test(input)) {
    return `${expression}${input}`;
  }

  if (input === ".") {
    const lastNumber = expression.split(/[+\-*/() ]/).pop();
    return lastNumber.includes(".") ? expression : `${expression}.`;
  }

  if (isOperator(input)) {
    const trimmedExpression = expression.trimEnd();

    if (!trimmedExpression) {
      return input === "-" ? "-" : expression;
    }

    if (isOperator(trimmedExpression.at(-1))) {
      return `${trimmedExpression.slice(0, -1).trimEnd()} ${input} `;
    }

    return `${trimmedExpression} ${input} `;
  }

  if (input === "(" || input === ")") {
    return `${expression}${input}`;
  }

  return expression;
};
