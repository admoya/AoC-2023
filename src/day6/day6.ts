import { run } from "../utils";
import input from "./input";

const sampleInput = `\
Time:      7  15   30
Distance:  9  40  200`;

const partOne = (input: string) => {
  const parsedInput = input
    .split('\n')
    .map(line => line.split(':')[1].trim())
    .map(line => line.split(' ').filter(n => n))
    .reduce<{time: number, distance: number}[]>((acc, curr, index) => {
      if (index === 0) {
        return [...acc, ...curr.map(t => ({ time: Number(t), distance: 0 }))]
      }
      curr.forEach((d, i) => {
          acc[i].distance = Number(d);
      });
      return acc;
    }, []);
    const waysToWin = parsedInput
      .map(({ time, distance}) => {
        let speed = time - 1;
        let winCount = 0;
        while (speed > 0) {
          const timeRemaining = time - speed;
          if (speed * timeRemaining > distance) {
            winCount += 1;
          }
          speed -= 1;
        }
        return winCount;
      });
    return waysToWin.reduce((acc, curr) => Math.max(1, acc) * curr, 0);
};

const partTwo = (input: string) => {
  const parsedInput = input
    .split('\n')
    .map(line => line.split(':')[1].trim())
    .map(line => line.replaceAll(' ', ''))
  const raceInfo = {
    time: Number(parsedInput[0]),
    distance: Number(parsedInput[1])
  }
  let waysToWin = 0;
  let speed = raceInfo.time - 1;
  while (speed > 0) {
    const timeRemaining = raceInfo.time - speed;
    if (speed * timeRemaining > raceInfo.distance) {
      waysToWin += 1;
    }
    speed -= 1;
  }
  return waysToWin;
};

run(input, partOne, partTwo);