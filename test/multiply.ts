import hi from "./pages/hi";

type MultiplyFunction = (a: number, b: number) => number;

const multiply: MultiplyFunction = (a: number, b: number) => {
  hi();
  return a * b;
};

export default multiply;
