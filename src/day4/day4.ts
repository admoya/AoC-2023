import input from './input';

const sampleInput = `\
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;


const partOne = (input: string) => {
  const parsedInput = input
    .replace(/Card \d+:/gm, '')
    .split('\n')
    .map(line => line.split('|'))
    .map(([winningNumbers, myNumbers]) => ([winningNumbers.split(' ').filter(v => v), myNumbers.split(' ').filter(v => v)]))
  
  const cardMatches = parsedInput.map(([winningNumbers, myNumbers]) => myNumbers.filter(number => winningNumbers.includes(number)));
  // console.log(cardMatches);
  const cardValues = cardMatches.map(cardMatch => cardMatch.length > 0 ? 2**(cardMatch.length-1) : 0)
  // console.log(cardValues);
  return cardValues.reduce((acc, curr) => acc + curr, 0);
}

const partTwo = (input: string) => {
  const parsedInput = input
    .replace(/Card \d+:/gm, '')
    .split('\n')
    .map(line => line.split('|'))
    .map(([winningNumbers, myNumbers]) => ([winningNumbers.split(' ').filter(v => v), myNumbers.split(' ').filter(v => v)]))
  
  const cardMatches = parsedInput.map(([winningNumbers, myNumbers]) => myNumbers.filter(number => winningNumbers.includes(number)));
  const cardMatchesWithInstances: [string[], number][] = cardMatches.map(cardMatch => [cardMatch, 1]);
  cardMatchesWithInstances.forEach(([cardMatch, instances], i) => {
    cardMatch.forEach((num, j) => {
      cardMatchesWithInstances[i+j+1][1] += instances;
    })
  })
  return cardMatchesWithInstances.reduce((curr, [cardMatch, instances]) => curr + instances, 0);
}

console.log(`Part One: ${partOne(input)}`);
console.log(`Part Two: ${partTwo(input)}`);
