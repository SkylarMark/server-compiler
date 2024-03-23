import multiply from "./multiply";

type AddFunction = (a: number, b: number) => number;

const add: AddFunction = (a: number, b: number) => {
  console.log(process.env.TEST_VARIABLE);
  return multiply(a + b, process.env.TEST_VARIABLE as unknown as number);
};

console.log(add(5, 1));
