export const run = (input: string, partOne: (input: string) => any, partTwo?: (input: string) => any) => {
  const partOneStart = Date.now();
  const result = partOne(input);
  const partOneEnd = Date.now();
  console.log(`Part One: ${result}. Time: ${partOneEnd - partOneStart}ms`);

  if (partTwo) {
    const partTwoStart = Date.now();
    const result = partTwo(input);
    const partTwoEnd = Date.now();
    console.log(`Part Two: ${result}. Time: ${partTwoEnd - partTwoStart}ms`);
  }
}