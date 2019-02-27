import { assoc, concat, curry, head, reverse } from "ramda";
import { getCardSuite, getCardLabel } from "../lib/deck";
import { playerNum } from "./game";

export function TraceItem(s) {
  return `<li>${s}</li>`;
}

export function Trace(trace) {
  return reverse(trace)
    .map(TraceItem)
    .join("");
}

export const addTrace = curry(function addTrackToTrace(newTrack, state) {
  return assoc("trace", concat(state.trace, [newTrack]), state);
});

const topCardString = pile =>
  `${getCardLabel(head(pile))}${getCardSuite(head(pile))}`;

export function playTrace(state) {
  const playedCard = topCardString(state.pile[state.playerTurn]);
  return addTrace(`P${playerNum(state)} ${playedCard}`, state);
}
