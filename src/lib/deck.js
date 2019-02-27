import { pipe, equals, take, head, last, prop, reduce, nth } from "ramda";
import shuffleArray from "./shuffleArray";
import trace from "./trace";

export const getCardSuite = prop("suite"); //head;
export const getCardLabel = prop("label"); //nth(1);
export const getCardValue = prop("value"); //nth(2);

/** Compare 2 cards. */
export const isSameSuite = (card1, card2) =>
  equals(getCardSuite(card1), getCardSuite(card2));

export function shuffleUpAndDeal(pileCount = 2, deck = []) {
  const part = Math.floor(deck.length / pileCount);
  const mutableDeck = [...deck];
  const newPiles = [];
  while (mutableDeck.length > 0) {
    newPiles.push(mutableDeck.splice(0, part));
  }
  return take(pileCount, newPiles);
}

export function createDeck() {
  // TODO: implement with R.lift

  const suites = ["♠︎", "♣︎", "♥︎", "♦︎"];
  const values = [
    ["2", 2],
    ["3", 3],
    ["4", 4],
    ["5", 5],
    ["6", 6],
    ["7", 7],
    ["8", 8],
    ["9", 9],
    ["10", 10],
    ["Kn", 11],
    ["Q", 12],
    ["K", 13],
    ["A", 14]
  ];
  const reducer = values => (deck, currentSuite) => {
    values.forEach(value =>
      deck.push({
        suite: currentSuite,
        label: value[0],
        value: value[1]
      })
    );
    return deck;
  };
  const addSuitesToValues = reducer(values);
  return shuffleArray(reduce(addSuitesToValues, [], suites));
}
