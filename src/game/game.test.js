import { addCardToPile, isGameOver, winnerTakesPile } from "./game";

it("addCardToPile(): should take top card of hand and add to top of pile", () => {
  const playerHand = [["A"], ["B"]];

  const state = {
    playerTurn: 1,
    hands: [[], [["A"], ["B"]], [], []],
    pile: [[], [["C"]], [], []]
  };
  const expected = {
    playerTurn: 1,
    hands: [[], [["B"]], [], []],
    pile: [[], [["A"], ["C"]], [], []]
  };
  expect(addCardToPile(state)).toEqual(expected);
});

it("winnerTakesPile(): Should take winning piles and add to winner hand", () => {
  const state = {
    playerTurn: 0,
    trace: [],
    pile: [
      [{ suite: "a", label: "2", value: 2 }],
      [{ suite: "a", label: "3", value: 3 }],
      [],
      []
    ],
    hands: [[], [{ suite: "b", label: "10", value: 10 }]]
  };

  const expected = {
    playerTurn: 0,
    trace: ["P2 ★"],
    pile: [[], [], [], []],
    hands: [
      [],
      [
        { suite: "b", label: "10", value: 10 },
        { suite: "a", label: "3", value: 3 },
        { suite: "a", label: "2", value: 2 }
      ]
    ]
  };

  expect(winnerTakesPile(state)).toEqual(expected);
});

it("isGameOver(): Should set gameOver state when a player has 0 cards", () => {
  const state = {
    hands: [["1", "2", "3"], []],
    gameOver: ""
  };
  expect(isGameOver(state).gameOver.length).toBeGreaterThan(0);
});
