import { assoc, concat, pipe, map, curry, head, reverse } from "ramda";
import { topCardString } from "../lib/deck";
import { playerNum } from "./game";

/** Regular a list item */
const TraceItem = s => `<li>${s}</li>`;

/** Screen reader should call out the latest card played */
const TraceHead = s => `<li aria-atomic="true" aria-live="polite">${s}</li>`;

/** Split and combine the latest items and the rest and add markup */
const traceMarkup = ([head, ...tail]) =>
  concat(
    [TraceHead(head)], // Take the latest value and use as head.
    map(TraceItem)(tail) // Take the rest of the items as body
  ).join(""); // And avoid "," comma in markup.

/**  array: TraceList -> string: HtmlListItems */
export const Trace = pipe(
  reverse,
  traceMarkup
);

export const addTrace = curry(function addTrackToTrace(newTrack, state) {
  return assoc("trace", concat(state.trace, [newTrack]), state);
});

/**  */

export const playTrace = state => {
  const playedCard = topCardString(state.pile[state.playerTurn]);
  return addTrace(`P${playerNum(state)} ${playedCard}`, state);
};
