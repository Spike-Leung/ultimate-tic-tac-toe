import { checkTictactoeWinner } from "./util.js";
import { player_mark } from "./config.js";
import { tic_tac_toe } from "./tic-tac-toe.js";

export class game {
  constructor() {
    this.records = [];
    this.turns = 0;
    this.hasInited = false;
    this.ticTacToeInstances = null;
    this.congratulationInterval = null;
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
    document
      .querySelector(".reset-button")
      .addEventListener("click", this.resetGame.bind(this));
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

    const winner = checkTictactoeWinner(this.records);

    if (winner !== "Pending") {
      this.messageFinishInfo(winner);
      this.showCongratulation(winner);

      setTimeout(() => this.removeCongratulation(), 12000);
    } else {
      this.switchPlayer(nextPlayer);
      this.setNextActiveTicTacToe(latticeIndex);
    }
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
    this.gameElement.removeAttribute("data-winner-message", "");

    this.removeCongratulation();
  }

  messageFinishInfo(result) {
    const resultMap = {
      1: "Player 1 win!",
      2: "Player 2 win!",
      Draw: "Draw",
    };

    this.gameElement.setAttribute("data-winner-message", resultMap[result]);
  }

  showCongratulation(winner) {
    if (winner === "Draw") {
      return;
    }

    const congratulationContainerEle = document.querySelector(
      ".congratulation-container"
    );

    congratulationContainerEle.setAttribute("data-winner", winner);

    this.congratulationInterval = setInterval(() => {
      const left = Math.random() * 100 + "vw";
      const size = Math.random() * 5 + 5 + "px";
      const speed = ["slow", "medium", "fast"][Math.floor(Math.random() * 3)];
      const color = ["tomato", "orange", "dodgerblue", "mediumseagreen", "gray", "slateblue", "violet"];
      const scrapElement = document.createElement("div");

      scrapElement.style.left = left;
      scrapElement.style.width = size;
      scrapElement.style.height = size;
      scrapElement.style.background = color[Math.floor(Math.random() * color.length)];
      scrapElement.classList.add("scrap", `scrap--confetti-${speed}`);

      congratulationContainerEle.appendChild(scrapElement);

      setTimeout(() => {
        scrapElement.parentNode.removeChild(scrapElement);
      }, 3000);
    }, 20);
  }

  removeCongratulation() {
    this.congratulationInterval && clearInterval(this.congratulationInterval);
  }
}
