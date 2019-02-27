/* 
TODO: More then 2 players. 
*/
import { pipe, invoker } from "ramda";
import { createStore } from "./store";
import { addClickEvent } from "./lib/addClickEvent";
import { trace } from "./lib/trace";
import { createMarkup } from "./game/markup";
import { playTrace } from "./game/traceComponent";
import {
  setNextPlayer,
  roundEnd,
  createInitialState,
  createDeckAndHands,
  addCardToPile
} from "./game/game";

import "./styles.css";

/** Create initial game state */
const initialState = createInitialState(createDeckAndHands(2));

/** Create our store instance */
const Store = createStore(initialState);

/**
 * Bind the play and reset buttons to their functions
 * fn, fn -> undefined
 */
const bindEvents = (playFn, resetFn) => {
  addClickEvent("[data-play]", playFn);
  addClickEvent("[data-reset]", resetFn);
  return;
};

/** String, Node -> Nodelist  */
const cssQuery = invoker(1, "querySelector");

/** Node, state -> undefined */
const setInnerHtml = (target, data) => {
  target.innerHTML = createMarkup(data);
  return;
};

/**
 * The play action. Should call all functions needed for a player or
 * computer to have a turn.
 */
const Play = () => {
  return pipe(
    Store.getState,
    trace("gotState"),
    gameRound,
    roundEnd,
    Store.setState,
    render,
    playComputer
  )();
};

/**
 * Setup a new game
 */
const NewGame = () => {
  pipe(
    createDeckAndHands,
    createInitialState,
    Store.setState,
    StartGame
  )();
};

/** state -> state */
const render = data => {
  // redraw the complete markup. not a good solution.
  setInnerHtml(cssQuery("#app", document), data);
  // rebind the buttons
  bindEvents(Play, NewGame);
  // Focus play button
  cssQuery("[data-play]", document).focus();
  // return `data` for next fn in pipe.
  return data;
};

/**
 * Start the game when page is loaded.
 * And create + return function to start a new game.
 * state, fn -> fn
 */
const StartGame = (function init(data, renderFn) {
  // Create the render function
  function doRender(dataToRender) {
    renderFn(dataToRender);
  }
  // Do the initial render
  doRender(data);
  // Return the function to be stored in StartGame
  return doRender;
})(initialState, render);

/**
 * The actions in one round.
 * state -> state.
 */
const gameRound = pipe(
  addCardToPile,
  playTrace,
  render,
  setNextPlayer
);

/**
 * Do play computer turn automatic.
 * Asumes computer hand index is 1.
 */
const playComputer = ({ playerTurn, gameOver }) => {
  if (playerTurn === 1 && gameOver === "") {
    // Auto playing computer
    setTimeout(() => Play(), 700);
  }
  return;
};
