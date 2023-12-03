import input from './input';
const sampleInput = `\
467..114..
...*......
..35..633.
......#...
617*......
....+.58.
..592.....
......755.
...$.*....
.664.598..`

// Brute force AF
const partOne = (input: string) => { 
  const parsedInput = input.split('\n').map(line => line.split(''));
  const isNumber = (y: number, x: number) => Number.isInteger(Number(parsedInput[y][x]));
  const isSymbol = (y: number, x: number) => !isNumber(y, x) && parsedInput[y][x] !== '.';
  const hasAdjacentSymbol = (y:number, x: number) => {
    const maxX = parsedInput[0].length - 1;
    const maxY = parsedInput.length - 1;
    return (
      x > 0 && isSymbol(y, x-1) || 
      x < maxX &&  isSymbol(y, x+1) || 
      y > 0 && isSymbol(y-1, x) || 
      y > 0 && x > 0 && isSymbol(y-1, x-1) || 
      y > 0 && x < maxX && isSymbol(y-1, x+1) || 
      y < maxY && isSymbol(y+1, x) || 
      y< maxY && x > 0 && isSymbol(y+1, x-1) || 
      y < maxY && x < maxX && isSymbol(y+1, x+1)
    )};
  let currentNumber = '';
  let addCurrent = false;
  let total = 0;
  parsedInput.forEach((line, y) => {
    line.forEach((char, x) => {
      if (isNumber(y, x)) {
        currentNumber += parsedInput[y][x];
        if (!addCurrent && hasAdjacentSymbol(y, x)) {
          addCurrent = true;
        }
      }
      else {
        if (addCurrent) {
          total += Number(currentNumber);
        }
        currentNumber = '';
        addCurrent = false;
      }
    })
  })
  return total;
}

const partTwo = (input: string) => {
  const parsedInput = input.split('\n').map(line => line.split(''));
  const isNumber = (y: number, x: number) => Number.isInteger(Number(parsedInput[y][x]));
  const isSymbol = (y: number, x: number) => !isNumber(y, x) && parsedInput[y][x] !== '.';
  const extractNumber = (y: number, x: number) => {
    if (y < 0 || x < 0 || y > parsedInput.length - 1 || x > parsedInput[0].length -1 || !isNumber(y, x)) return null;
    let xPointer = x;
    while (xPointer > 0 && isNumber(y, xPointer - 1)) {
      xPointer -= 1;
    }
    let numString = '';
    while (isNumber(y, xPointer)) {
      numString += parsedInput[y][xPointer];
      xPointer += 1;
    }
    return Number(numString);
  }
  const numbers: number[] = [];
  parsedInput.forEach((line, y) => {
    line.forEach((char, x) => {
      if (char === '*') {
        const adjacentNumbers = [
          extractNumber(y-1, x),
          // Avoid double counting a number
          !extractNumber(y-1, x) && extractNumber(y-1, x-1),
          !extractNumber(y-1, x) && extractNumber(y-1, x + 1),
          extractNumber(y, x - 1),
          extractNumber(y, x + 1),
          extractNumber(y + 1, x),
          // Avoid double counting a number
          !extractNumber(y + 1, x) && extractNumber(y + 1, x - 1),
          !extractNumber(y + 1, x) && extractNumber(y + 1, x + 1),
        ].filter((num): num is number => typeof num === 'number');
        if (adjacentNumbers.length === 2) {
          numbers.push(adjacentNumbers[0] * adjacentNumbers[1]);
        }
      }
    })
  })
  return numbers.reduce((acc, curr) => acc + curr, 0);
}

console.log(`Part one: ${partOne(input)}`);
console.log(`Part two: ${partTwo(input)}`);
