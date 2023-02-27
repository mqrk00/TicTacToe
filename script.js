const gameBoard = (() => {
  const rows = 3;
  const columns = 3;
  const board = [];
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push("");
    }
  }
  const getBoard = () => board;

  return { getBoard };
})();

const createPlayers = (symbol) => {
  const getSymbol = () => symbol;

  return { getSymbol };
};

const playerOne = createPlayers("x");
const playerTwo = createPlayers("o");

const gameController = (() => {
  let board = gameBoard.getBoard();
  let activePlayer = playerOne;


  const switchPlayerTurn = () => {
    activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
  };
  const getActivePlayer = () => activePlayer;


  const playRound = (row, column) => {
    board[row][column] = getActivePlayer().getSymbol();
    switchPlayerTurn();
    winCheck();
  };
  const winCheck = () => {
    let count = 0;
    const oneDimBoard = [].concat(...board);
    for (let j = 0; j < 9; j++) {
      if (oneDimBoard[j] != "") count++;
    }
    if (count <= 8) {
      count = 0;
    } else if (count > 8) {
      console.log("Its a tie");
      displayController.displayWinner(0);
      restart();
    }

    const winningConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i <= 7; i++) {
      const winCondition = winningConditions[i];
      let a = oneDimBoard[winCondition[0]];
      let b = oneDimBoard[winCondition[1]];
      let c = oneDimBoard[winCondition[2]];

      if (a === "" || b === "" || c === "") {
        continue;
      }

      if (a === b && b === c) {
        if (a && b && c === "o") {
            displayController.displayWinner(1);
          console.log("o wins");
        } else if (a && b && c === "x") {
            displayController.displayWinner(2);
          console.log("x wins");
        }
        restart();
        break;
      }
    }
  };

  const restart = () => {
    activePlayer = playerOne;
    const cells = document.querySelectorAll(".cell");
    for (let i = 0; i < cells.length; i++) {
      cells[i].disabled = false;
      cells[i].textContent = "";
    }

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        board[i][j] = "";
      }
    }
  };

  return { getActivePlayer, playRound, switchPlayerTurn, restart};
})();

const displayController = (() => {
  const boardDiv = document.querySelector("#board");
  const board = gameBoard.getBoard();
  const restartButton = document.querySelector("#restart");
  const player1 = document.querySelector("#player1");
  player1.setAttribute("style", "border:2px solid red;");
  const player2 = document.querySelector("#player2");

 
  restartButton.addEventListener("click",()=> {
    gameController.restart();
});
  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      const cellButton = document.createElement("button");
      cellButton.dataset.row = i;
      cellButton.dataset.column = j;
      cellButton.classList.add("cell");
      boardDiv.appendChild(cellButton);
    });
  });
  const displayWinner = (a) => {
    const boardContainer = document.querySelector("#container");
    boardContainer.setAttribute("style", "filter: blur(2px);");
    const displayWinnerDiv = document.querySelector("#displayWinner");
    const title = document.querySelector("#title");
    if (a === 1) {
      title.textContent = `o won`;
    }
   else if (a === 2) {
         title.textContent = `x won`;
       }
    else title.textContent = `Its a tie!`;
    displayWinnerDiv.classList.add("show");

    displayWinnerDiv.addEventListener("click", () => {
        displayWinnerDiv.classList.remove("show");
        boardContainer.removeAttribute("style", "filter: blur(2px);");

    })
  };

  boardDiv.addEventListener("click", (e) => {
    if (e.target.classList.contains("cell")) {
      e.target.disabled = true;
      e.target.textContent = gameController.getActivePlayer().getSymbol();
      gameController.playRound(e.target.dataset.row, e.target.dataset.column);
      if(gameController.getActivePlayer().getSymbol() === "x") {
        player1.setAttribute("style", "border:2px solid red;");
        player2.removeAttribute("style", "border:2px solid red;");

      }
      else {
        player1.removeAttribute("style", "border:2px solid red;");
        player2.setAttribute("style", "border:2px solid red;");

      }
    }
  });
  return { displayWinner };
})();
