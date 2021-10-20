import { checkTictactoeWinner } from "./util.js";
import { player_mark } from "./config.js";

export class tic_tac_toe {
  constructor(singleTicTacToeElement) {
    this.records = [];
    this.singleTicTacToeElement = singleTicTacToeElement;
  }

  get result() {
    const winner = checkTictactoeWinner(this.records);
    let result = "Pending";

    if (winner !== "Pending") {
      result =
        winner === "Draw" ? "Draw" : winner === player_mark[1] ? "1" : "2";
      this.singleTicTacToeElement.setAttribute("data-result", result);
    }

    return result;
  }

  move(index, playerIndex) {
    const mark = player_mark[playerIndex];
    const lattice = this.singleTicTacToeElement.querySelector(
      `[data-index='${index}']`
    );

    if (!this.records[index]) {
      this.records[index] = mark;

      lattice.setAttribute("data-mark", mark);
      lattice.setAttribute("data-player", playerIndex);
    }

    return this.result;
  }

  reset() {
    this.records = [];
    this.finish = false;

    if (this.singleTicTacToeElement) {
      Array.from(
        this.singleTicTacToeElement.querySelectorAll(".lattice")
      ).forEach((lattice) => {
        ["mark", "player"].forEach((attr) => {
          lattice.removeAttribute(`data-${attr}`);
        });
      });

      this.singleTicTacToeElement.removeAttribute("data-result");
    }
  }
}
