import { tail, assoc, concat, path, clone, prop, pipe, head } from "ramda";
import { addTrace } from "./traceComponent";
import {
  shuffleUpAndDeal,
  createDeck,
  getCardValue,
  isSameSuite
} from "../lib/deck";

/**
 * Reset piles to empty state
 */
function resetPiles() {
  // TODO: 3-4 player; anly reset taken piles by index.
  return [[], [], [], []];
}

export const playerNum = ({ playerTurn }) => playerTurn + 1;

/**
 * Creates and divides N number of hands
 */
export const createDeckAndHands = (numberOfHands = 2) => {
  const deck = createDeck();
  const hands = shuffleUpAndDeal(numberOfHands, deck);
  return {
    deck,
    hands
  };
};

/**
 * Check if game is over.
 * Happens when any player has 0 cards.
 */
export const isGameOver = data => {
  let newState = clone(data);
  data.hands.forEach((hand, idx) => {
    if (hand.length === 0) {
      newState = assoc("gameOver", `Player ${idx + 1} looses`, data);
    }
  });

  return newState;
};

/**
 * Handle logic for that happens when a round is over
 */
export const roundEnd = pipe(
  winnerTakesPile,
  isGameOver
);

const keysToCompare = (idx, cur) => ({ playedBy: idx, card: cur });

/**
 * Compare top cards of all the piles and return <keysToCompare>
 * stored in { toCompare } object.
 */
const getPilesWithSameSuiteReducer = (acc, cur, idx) => {
  acc.suites = acc.suites || [];
  acc.toCompare = acc.toCompare || [];

  if (cur) {
    // TODO: Check how this works with more then 2 hands.
    const c = acc.suites.filter(a => isSameSuite(cur, a.card));

    if (c.length > 0) {
      // add current card and other with same suite to
      // array with cards to compare.
      acc.toCompare.push(keysToCompare(idx, cur), ...c);
    } else {
      // add current card to temp array that store the suites.
      acc.suites.push(keysToCompare(idx, cur));
    }
  }
  return acc;
};

export const isLastPlayer = ({ playerTurn, hands }) =>
  playerTurn === hands.length - 1;

export const getNextPlayer = state =>
  isLastPlayer(state) ? 0 : playerNum(state);

export const setNextPlayer = state =>
  assoc("playerTurn", getNextPlayer(state), state);

export const createInitialState = ({ deck, hands }) => ({
  playerTurn: 0,
  gameOver: "",
  pile: [[], [], [], []],
  trace: ["New game"],
  deck,
  hands
});

const winningValueReducer = (acc, cur) => {
  const value = getCardValue(cur.card);
  if (value > acc) {
    acc = value;
  }
  return acc;
};

const isNewTurn = ({ playerTurn }) => playerTurn === 0;
/**
 * check if any piles have the same suite.
 * the pile with highest value wins. take the other piles.
 */
export function winnerTakesPile(data) {
  if (!isNewTurn(data)) {
    return data;
  }
  // TODO: Refactor this function. Break up into smaller functions
  // TODO: Make it more functional with ramda.
  // TODO: Make it work with more then 2 players.
  const mutableState = clone(data);

  const topCards = data.pile.map(head);

  const { toCompare } = topCards.reduce(getPilesWithSameSuiteReducer, {});

  if (toCompare.length === 0) {
    return data;
  }

  // TODO: create lens to get num value and suite from card.
  const winningValue = toCompare.reduce(winningValueReducer, -1);
  const playedBy = prop("playedBy");
  const winningHand = playedBy(
    toCompare.find(o => getCardValue(o.card) === winningValue)
  );

  const otherHands = toCompare
    .filter(o => getCardValue(o.card) !== winningValue)
    .map(playedBy);

  const pilesToTake = [winningHand, ...otherHands];
  const taken = [];
  pilesToTake.forEach(idx => {
    taken.push(...data.pile[idx]);
  });

  const winnersHand = concat(path(["hands", winningHand], data), [...taken]);

  // TODO: Use ramda methods
  mutableState.hands[winningHand] = winnersHand;

  const newState = {
    ...mutableState,
    pile: resetPiles()
  };
  return addTrace(`P${winningHand + 1} ★`, newState);
}

/**
 * Will return hand of the current player.
 */
export const getCurrentHand = ({ hands, playerTurn }) => hands[playerTurn];

/**
 * Will return a new state object with
 * the current players top card in the pile
 */
export const addCardToPile = data => {
  const pileIndex = data.playerTurn;
  let mutablePile = [...data.pile];

  let mutableHands = [...data.hands];
  const currentHand = getCurrentHand(data);
  mutableHands[pileIndex] = tail(currentHand);

  const playedCard = head(currentHand);
  mutablePile[pileIndex] = concat([playedCard], mutablePile[pileIndex]);
  const newHand = tail(currentHand);

  return {
    ...data,
    pile: [...mutablePile],
    hands: [...mutableHands]
  };
};
