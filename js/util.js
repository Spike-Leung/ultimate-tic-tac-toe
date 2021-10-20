/**
 *
 * @param {number[][]} moves
 * @return {string}
 */
export function checkTictactoeWinner(records) {
  let result = "";
  const turns = records.filter((r) => !!r).length;
  const winCombinations = [
    "012",
    "345",
    "678",
    "036",
    "147",
    "258",
    "048",
    "246",
  ];

  winCombinations.some((w) => {
    const a = records[w[0]];
    const b = records[w[1]];
    const c = records[w[2]];

    // not empty and all be same
    if (a && b && c && a == b && a == c) {
      result = a;
      return true;
    }

    return false;
  });

  return result || (turns === 9 ? "Draw" : "Pending");
}
