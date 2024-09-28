document.addEventListener('DOMContentLoaded', () => {
  const gridDisplay = document.getElementById('game-container');
  const scoreDisplay = document.getElementById('score');
  const highScoreDisplay = document.getElementById('high-score');
  const width = 4;
  let squares = [];
  let score = 0;
  let highScore = 0;

  // Load high score from localStorage
  const savedHighScore = localStorage.getItem('highScore');
  if (savedHighScore) {
    highScore = parseInt(savedHighScore);
    highScoreDisplay.innerHTML = 'High Score: ' + highScore;
  }

  // Create the playing board
  function createBoard() {
    const savedGameState = localStorage.getItem('gameState');
    if (savedGameState) {
      loadGameState(JSON.parse(savedGameState));
    } else {
      for (let i = 0; i < width * width; i++) {
        let square = document.createElement('div');
        square.innerHTML = '';
        square.classList.add('tile');
        gridDisplay.appendChild(square);
        squares.push(square);
      }
      generateNewTile();
      generateNewTile();
    }
  }

  createBoard();

  // Generate a new tile
  function generateNewTile() {
    let emptySquares = squares.filter(square => square.innerHTML == '');
    if (emptySquares.length == 0) return;

    let randomSquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    randomSquare.innerHTML = 2;
    updateTileClasses();
  }

  // Save game state to localStorage
  function saveGameState() {
    const gameState = {
      tiles: squares.map(square => square.innerHTML),
      score: score
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }

  // Load game state from localStorage
  function loadGameState(gameState) {
    for (let i = 0; i < width * width; i++) {
      let square = document.createElement('div');
      square.innerHTML = gameState.tiles[i];
      square.classList.add('tile');
      gridDisplay.appendChild(square);
      squares.push(square);
    }
    score = gameState.score;
    scoreDisplay.innerHTML = 'Score: ' + score;
    updateTileClasses();
  }

  // Reset game
  function resetGame() {
    localStorage.removeItem('gameState');
    score = 0;
    scoreDisplay.innerHTML = 'Score: ' + score;
    gridDisplay.innerHTML = '';
    squares = [];
    createBoard();
  }

  document.getElementById('new-game-btn').addEventListener('click', resetGame);

  // Move functions
  function moveRight() {
    let moved = false;
    for (let i = 0; i < 16; i += 4) {
      let row = [
        parseInt(squares[i].innerHTML) || 0,
        parseInt(squares[i + 1].innerHTML) || 0,
        parseInt(squares[i + 2].innerHTML) || 0,
        parseInt(squares[i + 3].innerHTML) || 0
      ];

      let filteredRow = row.filter(num => num);
      let missing = 4 - filteredRow.length;
      let zeros = Array(missing).fill(0);
      let newRow = zeros.concat(filteredRow);

      for (let j = 0; j < 4; j++) {
        if (squares[i + j].innerHTML != (newRow[j] ? newRow[j] : '')) {
          squares[i + j].innerHTML = newRow[j] ? newRow[j] : '';
          moved = true;
        }
      }
    }
    if (moved) {
      updateTileClasses();
      generateNewTile();
      saveGameState();
      checkForWin();
      checkForGameOver();
    }
  }

  function moveLeft() {
    let moved = false;
    for (let i = 0; i < 16; i += 4) {
      let row = [
        parseInt(squares[i].innerHTML) || 0,
        parseInt(squares[i + 1].innerHTML) || 0,
        parseInt(squares[i + 2].innerHTML) || 0,
        parseInt(squares[i + 3].innerHTML) || 0
      ];

      let filteredRow = row.filter(num => num);
      let missing = 4 - filteredRow.length;
      let zeros = Array(missing).fill(0);
      let newRow = filteredRow.concat(zeros);

      for (let j = 0; j < 4; j++) {
        if (squares[i + j].innerHTML != (newRow[j] ? newRow[j] : '')) {
          squares[i + j].innerHTML = newRow[j] ? newRow[j] : '';
          moved = true;
        }
      }
    }
    if (moved) {
      updateTileClasses();
      generateNewTile();
      saveGameState();
      checkForWin();
      checkForGameOver();
    }
  }

  function moveDown() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
      let column = [
        parseInt(squares[i].innerHTML) || 0,
        parseInt(squares[i + 4].innerHTML) || 0,
        parseInt(squares[i + 8].innerHTML) || 0,
        parseInt(squares[i + 12].innerHTML) || 0
      ];

      let filteredColumn = column.filter(num => num);
      let missing = 4 - filteredColumn.length;
      let zeros = Array(missing).fill(0);
      let newColumn = zeros.concat(filteredColumn);

      for (let j = 0; j < 4; j++) {
        if (squares[i + (j * 4)].innerHTML != (newColumn[j] ? newColumn[j] : '')) {
          squares[i + (j * 4)].innerHTML = newColumn[j] ? newColumn[j] : '';
          moved = true;
        }
      }
    }
    if (moved) {
      updateTileClasses();
      generateNewTile();
      saveGameState();
      checkForWin();
      checkForGameOver();
    }
  }

  function moveUp() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
      let column = [
        parseInt(squares[i].innerHTML) || 0,
        parseInt(squares[i + 4].innerHTML) || 0,
        parseInt(squares[i + 8].innerHTML) || 0,
        parseInt(squares[i + 12].innerHTML) || 0
      ];

      let filteredColumn = column.filter(num => num);
      let missing = 4 - filteredColumn.length;
      let zeros = Array(missing).fill(0);
      let newColumn = filteredColumn.concat(zeros);

      for (let j = 0; j < 4; j++) {
        if (squares[i + (j * 4)].innerHTML != (newColumn[j] ? newColumn[j] : '')) {
          squares[i + (j * 4)].innerHTML = newColumn[j] ? newColumn[j] : '';
          moved = true;
        }
      }
    }
    if (moved) {
      updateTileClasses();
      generateNewTile();
      saveGameState();
      checkForWin();
      checkForGameOver();
    }
  }

  // Combine functions
  function combineRow() {
    let combined = false;
    for (let i = 0; i < 15; i++) {
      if ((i + 1) % 4 !== 0) {
        if (squares[i].innerHTML === squares[i + 1].innerHTML && squares[i].innerHTML !== '') {
          let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + 1].innerHTML);
          squares[i].innerHTML = combinedTotal;
          squares[i + 1].innerHTML = '';
          score += combinedTotal;
          scoreDisplay.innerHTML = 'Score: ' + score;
          if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            highScoreDisplay.innerHTML = 'High Score: ' + highScore;
          }
          combined = true;
        }
      }
    }
    if (combined) updateTileClasses();
  }

  function combineColumn() {
    let combined = false;
    for (let i = 0; i < 12; i++) {
      if (squares[i].innerHTML === squares[i + 4].innerHTML && squares[i].innerHTML !== '') {
        let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + 4].innerHTML);
        squares[i].innerHTML = combinedTotal;
        squares[i + 4].innerHTML = '';
        score += combinedTotal;
        scoreDisplay.innerHTML = 'Score: ' + score;
        if (score > highScore) {
          highScore = score;
          localStorage.setItem('highScore', highScore);
          highScoreDisplay.innerHTML = 'High Score: ' + highScore;
        }
        combined = true;
      }
    }
    if (combined) updateTileClasses();
  }

  // Update tile classes to reflect the correct colors
  function updateTileClasses() {
    squares.forEach(square => {
      square.className = 'tile';
      let value = square.innerHTML;
      if (value) {
        square.classList.add('tile-' + value);
      }
    });
  }

  // Assign key codes
  function control(e) {
    e.preventDefault();
    if (e.keyCode === 39) {
      keyRight();
    } else if (e.keyCode === 37) {
      keyLeft();
    } else if (e.keyCode === 38) {
      keyUp();
    } else if (e.keyCode === 40) {
      keyDown();
    }
  }
  document.addEventListener('keydown', control);

  // Add event listeners for mobile buttons
  document.getElementById('up-btn').addEventListener('click', keyUp);
  document.getElementById('down-btn').addEventListener('click', keyDown);
  document.getElementById('left-btn').addEventListener('click', keyLeft);
  document.getElementById('right-btn').addEventListener('click', keyRight);

  function keyRight() {
    moveRight();
    combineRow();
    moveRight();
  }

  function keyLeft() {
    moveLeft();
    combineRow();
    moveLeft();
  }

  function keyDown() {
    moveDown();
    combineColumn();
    moveDown();
  }

  function keyUp() {
    moveUp();
    combineColumn();
    moveUp();
  }

  // Check for win
  function checkForWin() {
    if (squares.some(square => square.innerHTML == 2048)) {
      alert('You Win!');
      document.removeEventListener('keydown', control);
      // Remove button event listeners
      document.getElementById('up-btn').removeEventListener('click', keyUp);
      document.getElementById('down-btn').removeEventListener('click', keyDown);
      document.getElementById('left-btn').removeEventListener('click', keyLeft);
      document.getElementById('right-btn').removeEventListener('click', keyRight);
      localStorage.removeItem('gameState'); // Clear saved game state
    }
  }

  // Check for game over
  function checkForGameOver() {
    if (isBoardFull()) {
      let noMoves = true;
      for (let i = 0; i < 15; i++) {
        if ((i + 1) % 4 !== 0) {
          if (squares[i].innerHTML === squares[i + 1].innerHTML) {
            noMoves = false;
          }
        }
        if (i < 12) {
          if (squares[i].innerHTML === squares[i + 4].innerHTML) {
            noMoves = false;
          }
        }
      }
      if (noMoves) {
        alert('Game Over!');
        document.removeEventListener('keydown', control);
        // Remove button event listeners
        document.getElementById('up-btn').removeEventListener('click', keyUp);
        document.getElementById('down-btn').removeEventListener('click', keyDown);
        document.getElementById('left-btn').removeEventListener('click', keyLeft);
        document.getElementById('right-btn').removeEventListener('click', keyRight);
        localStorage.removeItem('gameState'); // Clear saved game state
      }
    }
  }

  // Check if the board is full
  function isBoardFull() {
    return squares.every(square => square.innerHTML != '');
  }
});

