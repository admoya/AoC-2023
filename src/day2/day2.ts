import realInput from './input';

const sampleInput = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;

type BallColorSet = { red: number, green: number, blue: number}
const partOne = (input: string, constraints: BallColorSet) => {
  const parsedInput: [number, BallColorSet[]][] = input
    .split('\n')
    .map(line => line.split(':'))
    .map(([idString, value]) => {
      const numericId = Number(idString.match(/\d+/)![0]);
      const ballSets: BallColorSet[] = value
        .split(';')
        .map(setString => ({
          red: Number(setString.match(/\d+(?= red)/)?.[0] ?? '0'),
          blue: Number(setString.match(/\d+(?= blue)/)?.[0] ?? '0'),
          green: Number(setString.match(/\d+(?= green)/)?.[0] ?? '0')
        }));
      return [numericId, ballSets]
    });
  // console.log(JSON.stringify(parsedInput, null, 2));
  const validGames = parsedInput
    .filter(([gameNo, ballSets]) => !ballSets.some(({blue, green, red}) => blue > constraints.blue || red > constraints.red || green > constraints.green))
    .map(([gameNumber]) => gameNumber)
  // console.log(`Valid games: ${validGames}`)
  return validGames.reduce((acc, curr) => acc + curr, 0);
}


const partTwo = (input: string, constraints: BallColorSet) => {
  const parsedInput: [number, BallColorSet[]][] = input
    .split('\n')
    .map(line => line.split(':'))
    .map(([idString, value]) => {
      const numericId = Number(idString.match(/\d+/)![0]);
      const ballSets: BallColorSet[] = value
        .split(';')
        .map(setString => ({
          red: Number(setString.match(/\d+(?= red)/)?.[0] ?? '0'),
          blue: Number(setString.match(/\d+(?= blue)/)?.[0] ?? '0'),
          green: Number(setString.match(/\d+(?= green)/)?.[0] ?? '0')
        }));
      return [numericId, ballSets]
    });
  // console.log(JSON.stringify(parsedInput, null, 2));
  const minCubesRequired = parsedInput
    .map(([gameNo, ballSets]) => ballSets.reduce(
      (acc, curr) => {
        return { 
          red: Math.max(acc.red, curr.red),
          blue: Math.max(acc.blue, curr.blue),
          green: Math.max(acc.green, curr.green)
        };
      }, { blue: 0, green: 0, red: 0}
    ))
  // console.log(`Valid games: ${validGames}`)
  return minCubesRequired
    .map(({red, blue, green}) => red * blue * green)
    .reduce((acc, curr) => acc + curr, 0);
}

console.log(`Part one: ${partOne(realInput, { red: 12, green: 13, blue: 14})}`);
console.log(`Part two: ${partTwo(realInput, { red: 12, green: 13, blue: 14})}`);
