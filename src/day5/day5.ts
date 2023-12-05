import input from './input';
import { run } from '../utils';
const sampleInput = `\
seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;

const partOne = (input: string) => {
  type ValueMapLine = { destinationStart: number, sourceStart: number, range: number };
  type ValueMap = ValueMapLine[];
    
  const seeds = input.split('\n')[0].split(':')[1].split(' ').filter(s=>s).map(num => Number(num));
  const valueMaps: {[name: string]: ValueMap} = [...input.matchAll(/(?<name>^.+) map:\n(?<values>[\d+ \n]+)/gm)]
    .map((match) => {
      return ({
      name: match.groups!['name'],
      valueMap: match.groups?.['values'].split('\n').filter(n=>n).map(line => line.split(' ')).map<ValueMapLine>(([ destinationStart, sourceStart, range ]) => ({
        destinationStart: Number(destinationStart), 
        sourceStart: Number(sourceStart), 
        range: Number(range)
      }))
    })})
    .reduce((acc, {name, valueMap}) => ({...acc, [name]: valueMap}), {})
  const mapNumber = (input: number, map: ValueMap) => {
    const mapLine = map.find(({destinationStart, sourceStart, range}) => input >= sourceStart && input < sourceStart + range);
    if (!mapLine) return input;
    return mapLine.destinationStart + (input - mapLine.sourceStart);
  }
  const chainMap = (seed: number, names: string[]) => {
    let current = seed;
    names.forEach(name => {
      current = mapNumber(current, valueMaps[name])
    });
    return current;
  }
  const mappedSeeds = seeds.map(seed => chainMap(seed, Object.keys(valueMaps)));
  return mappedSeeds.reduce((acc, curr) => curr < acc ? curr: acc, Number.MAX_SAFE_INTEGER);
}

const partTwoBruteForce = (input: string) => {
  type ValueMapLine = { destinationStart: number, sourceStart: number, range: number };
  type ValueMap = ValueMapLine[];
    
  const seeds = input
    .split('\n')[0]
    .split(':')[1]
    .split(' ')
    .filter(s=>s)
    .map(num => Number(num))
    .reduce<{min: number, max: number}[]>((acc, curr, index) => {
      if (index % 2 === 0) {
        return [...acc, { min: curr, max: 0 }];
      }
      acc[acc.length - 1].max = acc[acc.length - 1].min + curr - 1;
      return acc;
    }, []);
  const valueMaps: {[name: string]: ValueMap} = [...input.matchAll(/(?<name>^.+) map:\n(?<values>[\d+ \n]+)/gm)]
    .map((match) => {
      return ({
      name: match.groups!['name'],
      valueMap: match.groups?.['values'].split('\n').filter(n=>n).map(line => line.split(' ')).map<ValueMapLine>(([ destinationStart, sourceStart, range ]) => ({
        destinationStart: Number(destinationStart), 
        sourceStart: Number(sourceStart), 
        range: Number(range)
      }))
    })})
    .reduce((acc, {name, valueMap}) => ({...acc, [name]: valueMap}), {})
    const mapNumber = (input: number, map: ValueMap) => {
    const mapLine = map.find(({destinationStart, sourceStart, range}) => input >= sourceStart && input < sourceStart + range);
    if (!mapLine) return input;
    return mapLine.destinationStart + (input - mapLine.sourceStart);
  }
  const chainMap = (seed: number, names: string[]) => {
    let current = seed;
    names.forEach(name => {
      current = mapNumber(current, valueMaps[name])
    });
    return current;
  }
  let finalMin = Number.MAX_SAFE_INTEGER;
  seeds.forEach(({min, max}) => {
    let pointer = min;
    while (pointer <= max) {
      const mapped = chainMap(pointer, Object.keys(valueMaps));
      if ( mapped < finalMin)
        finalMin = mapped;
      pointer += 1;
    }
  });
  return finalMin;
}

// Optimize by inverting the problem, start from 0 and test final answers by mapping the numbers in reverse, the first one found is the lowest
const partTwo = (input: string) => {
  type ValueMapLine = { destinationStart: number, sourceStart: number, range: number };
  type ValueMap = ValueMapLine[];
    
  const seeds = input
    .split('\n')[0]
    .split(':')[1]
    .split(' ')
    .filter(s=>s)
    .map(num => Number(num))
    .reduce<{min: number, max: number}[]>((acc, curr, index) => {
      if (index % 2 === 0) {
        return [...acc, { min: curr, max: 0 }];
      }
      acc[acc.length - 1].max = acc[acc.length - 1].min + curr - 1;
      return acc;
    }, []);
  const valueMaps: {[name: string]: ValueMap} = [...input.matchAll(/(?<name>^.+) map:\n(?<values>[\d+ \n]+)/gm)]
    .map((match) => {
      return ({
      name: match.groups!['name'],
      // Invert source and destination
      valueMap: match.groups?.['values'].split('\n').filter(n=>n).map(line => line.split(' ')).map<ValueMapLine>(([ sourceStart, destinationStart, range ]) => ({
        destinationStart: Number(destinationStart), 
        sourceStart: Number(sourceStart), 
        range: Number(range)
      }))
    })})
    .reduce((acc, {name, valueMap}) => ({...acc, [name]: valueMap}), {})
  const mapNumber = (input: number, map: ValueMap) => {
    const mapLine = map.find(({destinationStart, sourceStart, range}) => input >= sourceStart && input < sourceStart + range);
    if (!mapLine) return input;
    return mapLine.destinationStart + (input - mapLine.sourceStart);
  }
  const chainMap = (seed: number, names: string[]) => {
    let current = seed;
    names.forEach(name => {
      current = mapNumber(current, valueMaps[name])
    });
    return current;
  }
  let finalMin = Number.MAX_SAFE_INTEGER;
  const mapNames = Object.keys(valueMaps).reverse();
  let pointer = 0;
  while (true) {
    const mapped = chainMap(pointer, mapNames);
    if (seeds.find(({min, max}) => mapped >= min && mapped < max))
      return pointer;
    pointer += 1;
  }
}


run(input, partOne, partTwo);
