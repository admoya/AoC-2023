import { run } from "../utils";
import input from './input';

const sampleInput = `\
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;

const partOne = (input: string) => {
  const parsedInput = input.split('\n').map(line => line.split(' ').map(n => Number(n)));
  const deriveLine = (line: number[]) => line.map((n, i) => line[i+1] - n).slice(0, line.length - 1);
  const computeFullDerivative = (line: number[]): number[][] => {
    const derivative = deriveLine(line);
    if (!derivative.some(n => n !== 0)) {
      return [line, derivative]
    }
    return [line, ...computeFullDerivative(derivative)];
  }
  const computePrediction = (fullDerivative: number[][]): number => {
    if (fullDerivative.length === 2) return fullDerivative[0].pop()! + fullDerivative[1].pop()!;
    const lastNumber = fullDerivative.pop()!.pop()!;
    const lastLine = fullDerivative.pop()!;
    lastLine.push(lastNumber + lastLine[lastLine.length - 1]);
    fullDerivative.push(lastLine);
    return computePrediction(fullDerivative);
  }
  return parsedInput
    .map((line) => computePrediction(computeFullDerivative(line)))
    .reduce((acc, curr) => acc + curr, 0);
}

const partTwo = (input: string) => {
  const parsedInput = input.split('\n').map(line => line.split(' ').map(n => Number(n)));
  const deriveLine = (line: number[]) => line.map((n, i) => line[i+1] - n).slice(0, line.length - 1);
  const computeFullDerivative = (line: number[]): number[][] => {
    const derivative = deriveLine(line);
    if (!derivative.some(n => n !== 0)) {
      return [line, derivative]
    }
    return [line, ...computeFullDerivative(derivative)];
  }
  const computePrediction = (fullDerivative: number[][]): number => {
    if (fullDerivative.length === 2) return fullDerivative[0][0] - fullDerivative[1][0];
    const firstNumberOfLastLine = fullDerivative.pop()![0];
    fullDerivative[fullDerivative.length-1][0] = fullDerivative[fullDerivative.length-1][0] - firstNumberOfLastLine;
    return computePrediction(fullDerivative);
  }
  return parsedInput
    .map((line) => computePrediction(computeFullDerivative(line)))
    .reduce((acc, curr) => acc + curr, 0);
}

run(input, partOne, partTwo);