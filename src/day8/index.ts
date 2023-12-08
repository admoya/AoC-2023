import { run } from "../utils";
import input from "./input";

const sampleInput1 = `\
RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`;

const sampleInput2 = `\
LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`;

const sampleInput3 = `\
LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`;

const partOne = (input: string) => {
  const parsedInput = input.split('\n').filter(line => line.trim());
  const directions = parsedInput.splice(0, 1)[0].split('').map(d => d === 'R' ? 'right' : 'left');
  const nodes: {[name: string]: { left: string, right: string}} = parsedInput
    .map(line => line.split(' = '))
    .map(([name, directions]) => {
      const [left, right] = directions.replace('(', '').replace(')', '').split(', ');
      return {
        name,
        left,
        right
      }
    })
    .reduce((acc, { name, left, right }) => ({...acc, [name]: {left, right}}), {});
  let current = 'AAA';
  let directionsPointer = 0;
  let steps = 0;
  while (current != 'ZZZ') {
    steps += 1;
    current = nodes[current][directions[directionsPointer]];
    directionsPointer = (directionsPointer + 1) % directions.length;
  }
  return steps;
};

const partTwo = (input: string) => {
  const parsedInput = input.split('\n').filter(line => line.trim());
  const directions = parsedInput.splice(0, 1)[0].split('').map(d => d === 'R' ? 'right' : 'left');
  const nodes: {[name: string]: { left: string, right: string}} = parsedInput
    .map(line => line.split(' = '))
    .map(([name, directions]) => {
      const [left, right] = directions.replace('(', '').replace(')', '').split(', ');
      return {
        name,
        left,
        right
      }
    })
    .reduce((acc, { name, left, right }) => ({...acc, [name]: {left, right}}), {});
  
  let ghostPositions = Object.keys(nodes).filter(name => name.endsWith('A'));
  let directionsPointer = 0;
  let step = 0;
  const terminations = ghostPositions.map(() => ({ step: 0, delta: 0, looping: false}));
  while (ghostPositions.some(gp => !gp.endsWith('Z'))) {
    ghostPositions.forEach((gp, index) => {
      if (!terminations[index].looping && gp.endsWith('Z')) {
        const previousTermination = terminations[index];
        if (step - previousTermination.step === previousTermination.delta) {
          previousTermination.looping = true;
        } else {
          previousTermination.delta = step - previousTermination.step;
          previousTermination.step = step; 
        }
      }
    })
    if (!terminations.some(t => !t.looping)) break;
    step += 1;
    ghostPositions = ghostPositions.map(gp => nodes[gp][directions[directionsPointer]]);
    directionsPointer = (directionsPointer + 1) % directions.length;
  }
  const greatestDelta = Math.max(...terminations.map(t => t.delta));
  let finalStep = greatestDelta;
  while (terminations.some(t =>( finalStep % t.delta !== 0))) {
    finalStep += greatestDelta;
  }
  return finalStep;
};

run(input, partOne, partTwo);
