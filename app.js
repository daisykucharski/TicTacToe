// factory function to create Players
const player = (name, marker) => {
  return { name, marker };
};

// stores the state of the board
const gameBoard = (() => {
  let board = Array(9).fill("");

  const resetBoard = () => {
    board = Array(9).fill("");
  };

  const getMarkerAtSpace = (space) => {
    return board[space];
  };
  const fillSpace = (space, player) => {
    board[space] = player.marker;
  };

  return { resetBoard, getMarkerAtSpace, fillSpace };
})();


// controls interaction with the user and sets up the board to show the user
const viewController = (() => {
  const board = document.querySelector("#gameboard");
  const message = document.querySelector("#message");
  const reset = document.querySelector("button");

  // sets up the board in the DOM and adds in the appropriate action listeners
  for (i = 0; i < 9; i++) {
    const square = document.createElement("div");
    square.className = "square";
    square.setAttribute("data", i);
    square.textContent = gameBoard.getMarkerAtSpace(i);

    square.addEventListener("click", (event) => {
      model.playRound(Number(event.target.getAttribute("data")));
      updateDisplay();
    });

    board.appendChild(square);
  }

  // sets up the reset button
  reset.addEventListener("click", () => {
    model.resetGame();
    updateDisplay();
  });

  // updates the display to reflect the current board state
  const updateDisplay = () => {
    const squares = document.querySelectorAll(".square");
    for (i = 0; i < 9; i++) {
      squares[i].textContent = gameBoard.getMarkerAtSpace(i);
    }
  };

  // sets up the message above the game board
  const setMessage = (msg) => {
    message.textContent = msg;
  };

  return { setMessage };
})();


// handles the game logic
const model = (() => {
  const player1 = player("Player 1", "X");
  const player2 = player("Player 2", "O");

  let currentPlayer = player1;
  let gameOver = false;
  let roundNum = 1;

  // the current player places their mark at the given space, if able
  const playRound = (space) => {
    if (gameOver || gameBoard.getMarkerAtSpace(space) !== "") {
      return;
    }

    gameBoard.fillSpace(space, currentPlayer);

    if (gameWon()) {
      viewController.setMessage(currentPlayer.name + " wins!");
      gameOver = true;
      return;
    }

    if (roundNum === 9) {
      viewController.setMessage("It's a tie!");
      gameOver = true;
      return;
    }

    roundNum++;
    switchPlayer();
  };

  // checks whether the current player has won the game
  const gameWon = () => {
    return checkDiagonals() || checkColumns() || checkRows();
  };

  // checks whether the current player has a column filled out
  const checkColumns = () => {
    for (i = 0; i < 3; i++) {
      let col = [];

      for (j = 0; j < 3; j++) {
        col.push(gameBoard.getMarkerAtSpace(i + j * 3));
      }

      if (col.every((marker) => marker === currentPlayer.marker)) {
        return true;
      }
    }

    return false;
  };

  // checks whether the current player has a row filled out
  const checkRows = () => {
    for (i = 0; i < 3; i++) {
      let row = [];

      for (j = i * 3; j < i * 3 + 3; j++) {
        row.push(gameBoard.getMarkerAtSpace(j));
      }

      if (row.every((marker) => marker === currentPlayer.marker)) {
        return true;
      }
    }
    return false;
  };

  // checks whether the current player has a diagonal filled out
  const checkDiagonals = () => {
    diagonal1 = [
      gameBoard.getMarkerAtSpace(0),
      gameBoard.getMarkerAtSpace(4),
      gameBoard.getMarkerAtSpace(8),
    ];
    diagonal2 = [
      gameBoard.getMarkerAtSpace(2),
      gameBoard.getMarkerAtSpace(4),
      gameBoard.getMarkerAtSpace(6),
    ];

    return (
      diagonal1.every((marker) => marker === currentPlayer.marker) ||
      diagonal1.every((marker) => marker === currentPlayer.marker)
    );
  };

  // switches the player in control of the board and the message displaying who is playing
  const switchPlayer = () => {
    if (currentPlayer === player1) {
      currentPlayer = player2;
      viewController.setMessage("Player 2, it's your turn");
    } else {
      currentPlayer = player1;
      viewController.setMessage("Player 1, it's your turn");
    }
  };

  // resets the game to what it was before anyone played
  const resetGame = () => {
    gameBoard.resetBoard();
    roundNum = 1;
    currentPlayer = player1;
    viewController.setMessage("Player 1, it's your turn");
    gameOver = false;
  };

  return { playRound, resetGame };
})();
