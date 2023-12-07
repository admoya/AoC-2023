import { run } from "../utils";
import input from './input';
import fs from 'fs';

const sampleInput = `\
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

const customSampleInput = `\
AAAAA 765
28546 100
KKKKK 765
AAQAA 765
AATAA 765
J55J5 684
J55J5 685
A55A5 686
J55J5 687
KK6K7 28
KTJJT 220
K3JJT 220
Q4751 483
Q9351 483
Q4351 483\
`;

const partOne = (input: string) => {
  const cardValues = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
  const fiveOfAKindRegex = new RegExp(cardValues.join('{5}|') + '{5}');
  const fourOfAKindRegex = new RegExp(cardValues.join('{4}|') + '{4}');
  const threeOfAKindRegex = new RegExp(cardValues.join('{3}|') + '{3}');
  const pairRegex = new RegExp(cardValues.join('{2}|') + '{2}');

  const sortHand = (hand: string) => hand.split('').sort().join('');
  // These need to be run in sequence and stopped when the first one is true, or else the result could be wrong
  const isFiveOfAKind = (hand: string) => !!sortHand(hand).match(fiveOfAKindRegex);
  const isFourOfAKind = (hand: string) => !!sortHand(hand).match(fourOfAKindRegex);
  const isFullHouse = (hand: string) => !!sortHand(hand).match(threeOfAKindRegex) && !!sortHand(hand).replace(threeOfAKindRegex, '').match(pairRegex);
  const isThreeOfAKind = (hand: string) => !!sortHand(hand).match(threeOfAKindRegex);
  const isTwoPair = (hand: string) => [...sortHand(hand).matchAll(new RegExp(pairRegex, 'g'))].length === 2;
  const isPair = (hand: string) => !!sortHand(hand).match(pairRegex);
  
  const getCardValue = (card: string) => cardValues.findIndex(c => c === card) + 1;
  const getHandValue = (hand: string) => {
    if (isFiveOfAKind(hand)) return 7; //Five of a Kind
    if (isFourOfAKind(hand)) return 6; //Four of a Kind
    if (isFullHouse(hand)) return 5; //Full House
    if (isThreeOfAKind(hand)) return 4; //Three of a Kind
    if (isTwoPair(hand)) return 3; //Two Pair
    if (isPair(hand)) return 2; //Pair
    return 1;
  }

  const parsedInput = input
  .split('\n')
  .map(line => ({ hand: line.split(' ')[0], bid: Number(line.split(' ')[1])}));
  
  const computedHands = parsedInput
    .map(({hand, bid}) => ({ 
      hand, 
      value: getHandValue(hand),
      bid
    }))
    .sort(({ hand: handA, value: a }, { hand: handB, value: b }) => {
      if (a !== b) return a-b;
      let i = 0;
      while (i < handA.length) {
        if (getCardValue(handA[i]) !== getCardValue(handB[i]))
          return getCardValue(handA[i]) - getCardValue(handB[i])
        i += 1;
      }
      return 0;
    })
    .map((hand, index) => ({...hand, rank: index + 1}))
    .map((hand) => ({...hand, winnings: hand.bid * hand.rank}));
  return computedHands.reduce((acc, curr) => acc + curr.winnings, 0);
};

const partTwo = (input: string) => {
  const cardValues = ['J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A'];
  const sortHand = (hand: string) => hand.split('').sort().join('');
  const computeLetterGroups = (hand: string) => [...sortHand(hand).matchAll(/(\w)\1*/g)].map((match) => match[0]);
  const getNumberOfJokers = (letterGroups: string[]) => letterGroups.find(lg => lg.includes('J'))?.length ?? 0;

  const hasFiveOfAKind = (hand: string) => {
    const letterGroups = computeLetterGroups(hand);
    const offset = getNumberOfJokers(letterGroups);
    return offset === 5 || letterGroups.some((group) => (group.length + offset) === 5);
  };
  const hasFourOfAKind = (hand: string) => {
    const letterGroups = computeLetterGroups(hand);
    const offset = getNumberOfJokers(letterGroups);
    return offset >= 3 || letterGroups.filter(g => !g.includes('J')).some((group) => (group.length + offset) >= 4);
  };
  const hasFullHouse = (hand: string) => {
    // Any offset higher than 1 results in a better hand if combined with a pair or triple 
    const letterGroups = computeLetterGroups(hand);
    const offset = getNumberOfJokers(letterGroups);
    if (letterGroups.some(g => g.length === 2) && letterGroups.some(g => g.length === 3)) return true;
    if (offset === 1 && letterGroups.filter(g => g.length === 2).length === 2) return true;
    return false; 
  }
  const hasThreeOfAKind = (hand: string) => {
    // Any offset higher than 2 results in a better hand
    const letterGroups = computeLetterGroups(hand);
    const offset = getNumberOfJokers(letterGroups);
    return offset === 2 || letterGroups.filter(g => !g.includes('J')).some((group) => (group.length + offset) === 3);
  };
  const hasTwoPair = (hand: string) => {
    // Any offset with a pair results in a better hand than this, so jokers can be ignored
    const letterGroups = computeLetterGroups(hand);
    return letterGroups.filter(group => group.length === 2).length === 2;
  };
  const hasPair = (hand: string) => {
    const letterGroups = computeLetterGroups(hand);
    const offset = getNumberOfJokers(letterGroups);
    return offset >=1 || letterGroups.some((group) => (group.length) == 2);
  };
  
  const getCardValue = (card: string) => cardValues.findIndex(c => c === card) + 1;
  const getHandValue = (hand: string) => {
    if (hasFiveOfAKind(hand)) return 7; //Five of a Kind
    if (hasFourOfAKind(hand)) return 6; //Four of a Kind
    if (hasFullHouse(hand)) return 5; //Full House
    if (hasThreeOfAKind(hand)) return 4; //Three of a Kind
    if (hasTwoPair(hand)) return 3; //Two Pair
    if (hasPair(hand)) return 2; //Pair
    return 1;
  }

  const parsedInput = input
  .split('\n')
  .map(line => ({ hand: line.split(' ')[0], bid: Number(line.split(' ')[1])}));
  
  const computedHands = parsedInput
    .map(({hand, bid}) => ({ 
      hand, 
      value: getHandValue(hand),
      bid
    }))
    .sort(({ hand: handA, value: a }, { hand: handB, value: b }) => {
      if (a !== b) return a-b;
      let i = 0;
      while (i < handA.length) {
        if (getCardValue(handA[i]) !== getCardValue(handB[i]))
          return getCardValue(handA[i]) - getCardValue(handB[i])
        i += 1;
      }
      return 0;
    })
    .map((hand, index) => ({...hand, rank: index + 1}))
    .map((hand) => ({...hand, winnings: hand.bid * hand.rank}));
  return computedHands.reduce((acc, curr) => acc + curr.winnings, 0);
};

run(input, partOne, partTwo);
