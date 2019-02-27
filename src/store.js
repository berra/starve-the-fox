import { mergeDeepRight } from "ramda";

export function createStore(initialState) {
  let state = initialState;

  function setState(newState) {
    state = mergeDeepRight(state, newState);
    return state;
  }

  function getState() {
    return state;
  }

  return Object.freeze({
    setState,
    getState
  });
}
