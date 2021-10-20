import { checkTictactoeWinner } from "./util.js";
import { player_mark } from "./config.js";
import { tic_tac_toe } from "./tic-tac-toe.js";

export class game {
  constructor() {
    this.records = [];
    this.turns = 0;
    this.hasInited = false;
    this.ticTacToeInstances = null;
  }

  get ticTacToeClass() {
    return "tic-tac-toe";
  }

  get ticTacToeActiveClass() {
    return "tic-tac-toe--active";
  }

  get gameElement() {
    return document.querySelector(".game");
  }

  init() {
    this.drawTicTacToe();
    this.initTicTacToeInstances();

    this.gameElement.addEventListener("click", this.onLatticeClick.bind(this));
  }

  drawTicTacToe() {
    const lattices = Array.from({ length: 9 })
      .map((i, index) => {
        return `<div class="lattice" data-index=${index}></div>`;
      })
      .join("");

    const ticTacToe = Array.from({ length: 9 })
      .map((i, index) => {
        return `<div class="${this.ticTacToeClass}" data-index=${index}>${lattices}</div>`;
      })
      .join("");

    this.gameElement.innerHTML = ticTacToe;
  }

  initTicTacToeInstances() {
    this.ticTacToeInstances = Array.from(
      document.querySelectorAll(`.${this.ticTacToeClass}`)
    ).map((ele) => new tic_tac_toe(ele));
  }

  onLatticeClick(event) {
    const { target } = event;
    const latticeIndex = target.getAttribute("data-index");
    const currentTicTacToe = target.closest(`.${this.ticTacToeClass}`);
    const ticTacToeIndex =
      currentTicTacToe && currentTicTacToe.getAttribute("data-index");

    if (!this.isValidClick(target)) {
      return;
    }

    this.turns++;

    const currentPlayer = this.turns % 2 === 0 ? 2 : 1;
    const nextPlayer = (this.turns + 1) % 2 === 0 ? 2 : 1;
    const result = this.ticTacToeInstances[ticTacToeIndex].move(
      latticeIndex,
      currentPlayer
    );

    if (result !== "Pending") {
      this.records[ticTacToeIndex] = result;
    }

    this.switchPlayer(nextPlayer);
    this.setNextActiveTicTacToe(latticeIndex);

    setTimeout(() => {
      this.messageFinishInfo(checkTictactoeWinner(this.records)) &&
        this.resetGame();
    }, 0);
  }

  switchPlayer(player) {
    document.querySelector(".game-wrapper").setAttribute("data-player", player);

    document.querySelector(
      `input[name='player'][value='${player}']`
    ).checked = true;
  }

  isValidClick(target) {
    const currentTicTacToe = target.closest(`.${this.ticTacToeClass}`);
    const isClickOnLattice = target.classList.contains("lattice");
    const isEmptyLattice = target.getAttribute("data-player") === null;
    const isClickOnActiveTicTacToe =
      currentTicTacToe &&
      currentTicTacToe.classList.contains(this.ticTacToeActiveClass);

    if (!isClickOnLattice) {
      return false;
    }

    if (!isEmptyLattice) {
      return false;
    }

    if (!this.hasInited) {
      this.hasInited = true;
      this.gameElement.classList.add("game--start");
      return true;
    } else {
      return isClickOnActiveTicTacToe;
    }
  }

  setNextActiveTicTacToe(latticeIndex) {
    Array.from(
      document.querySelectorAll(`.${this.ticTacToeClass}`)
    ).forEach((ele) => ele.classList.remove(this.ticTacToeActiveClass));

    if (!this.records[latticeIndex]) {
      document
        .querySelector(`.${this.ticTacToeClass}[data-index='${latticeIndex}']`)
        .classList.add(this.ticTacToeActiveClass);
    } else {
      Array.from({ length: 9 })
        .map((i, index) => index)
        .filter((i) => !this.records[i])
        .forEach((index) => {
          document
            .querySelector(`.${this.ticTacToeClass}[data-index='${index}']`)
            .classList.add(this.ticTacToeActiveClass);
        });
    }
  }

  resetGame() {
    this.ticTacToeInstances.forEach((i) => i.reset());
    this.records = [];
    this.turns = 0;
    this.hasInited = false;
    this.switchPlayer(1);

    Array.from(
      document.querySelectorAll(`.${this.ticTacToeClass}`)
    ).forEach((ele) => ele.classList.remove(this.ticTacToeActiveClass));

    this.gameElement.classList.remove("game--start");
  }

  messageFinishInfo(result) {
    const resultMap = {
      1: "Player 1 win!",
      2: "Player 2 win!",
      Draw: "Draw",
    };

    if (result === "Pending") {
      return false;
    }

    alert(resultMap[result]);

    return true;
  }
}
