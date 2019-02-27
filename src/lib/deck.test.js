import { isSameSuite } from "./deck";

it("isSameSuite(): should return true if cards are of same suite", () => {
  const card1 = ["a", "2", 2];
  const card2 = ["a", "3", 3];
  expect(isSameSuite(card1, card2)).toEqual(true);
});
