import input from './input';
// https://adventofcode.com/2023/day/1
// Input
// Should be 142
const partOneSampleInput = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`

const partTwoSampleInput = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;


const partOne = (input: string) => {
  const getFirstDigit = (line: string): string => {
    if (!Number.isNaN(Number(line[0])))
        return line[0];
    return getFirstDigit(line.substring(1));
  }
  const getLastDigit = (line: string): string => {
    const index = line.length - 1;
    if (!Number.isNaN(Number(line[index])))
      return line[index];
    return getLastDigit(line.substring(0, index));
  }
  const lines = input.split('\n');
  const numbers = lines.map(line => Number(`${getFirstDigit(line)}${getLastDigit(line)}`));
  return numbers.reduce((acc, curr) => acc + curr, 0);
}

const partTwo = (input: string) => {
  const textValues = new Map<string, Number>([
    ['one', 1],
    ['two', 2],
    ['three', 3],
    ['four', 4],
    ['five', 5],
    ['six', 6],
    ['seven', 7],
    ['eight', 8],
    ['nine', 9]
  ]);
  
  const extractDigits = (input: string, digits: Number[] = []): Number[] => {
    if (Number(input[0])) {
      digits.push(Number(input[0]));
    }
    if (input.length === 1) return digits;
    textValues.forEach((val, word) => {
      if (input.startsWith(word)) {
        digits.push(val);
      }
    });
    return extractDigits(input.substring(1), digits);
  }
  const lines = input.split('\n');
  const numbers = lines
    .map(line => extractDigits(line))
    .map(numberArr => Number(`${numberArr[0]}${numberArr[numberArr.length - 1]}`));
  return numbers.reduce((acc, curr) => acc + curr, 0);
}

console.log(`Part one: ${partOne(input)}`);
console.log(`Part two: ${partTwo(input)}`);
