document.addEventListener('DOMContentLoaded', () => {
  const gridDisplay = document.getElementById('game-container');
  const scoreDisplay = document.getElementById('score');
  const width = 4;
  let squares = [];
  let score = 0;

  // Create the playing board
  function createBoard() {
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

  createBoard();

  // Generate a new tile
  function generateNewTile() {
    let randomNumber = Math.floor(Math.random() * squares.length);
    if (squares[randomNumber].innerHTML == '') {
      squares[randomNumber].innerHTML = 2;
      squares[randomNumber].classList.add('tile-2');
    } else {
      if (isBoardFull()) {
        return;
      }
      generateNewTile();
    }
  }

  // Check if the board is full
  function isBoardFull() {
    return squares.every(square => square.innerHTML != '');
  }

  // Swipe right
  function moveRight() {
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
        squares[i + j].innerHTML = newRow[j] ? newRow[j] : '';
        squares[i + j].className = 'tile';
        if (newRow[j]) {
          squares[i + j].classList.add('tile-' + newRow[j]);
        }
      }
    }
  }

  // Swipe left
  function moveLeft() {
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
        squares[i + j].innerHTML = newRow[j] ? newRow[j] : '';
        squares[i + j].className = 'tile';
        if (newRow[j]) {
          squares[i + j].classList.add('tile-' + newRow[j]);
        }
      }
    }
  }

  // Swipe down
  function moveDown() {
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
        squares[i + (j * 4)].innerHTML = newColumn[j] ? newColumn[j] : '';
        squares[i + (j * 4)].className = 'tile';
        if (newColumn[j]) {
          squares[i + (j * 4)].classList.add('tile-' + newColumn[j]);
        }
      }
    }
  }

  // Swipe up
  function moveUp() {
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
        squares[i + (j * 4)].innerHTML = newColumn[j] ? newColumn[j] : '';
        squares[i + (j * 4)].className = 'tile';
        if (newColumn[j]) {
          squares[i + (j * 4)].classList.add('tile-' + newColumn[j]);
        }
      }
    }
  }

  // Combine row
  function combineRow() {
    for (let i = 0; i < 15; i++) {
      if ((i + 1) % 4 !== 0) {
        if (squares[i].innerHTML === squares[i + 1].innerHTML && squares[i].innerHTML !== '') {
          let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + 1].innerHTML);
          squares[i].innerHTML = combinedTotal;
          squares[i + 1].innerHTML = '';
          squares[i].className = 'tile';
          squares[i].classList.add('tile-' + combinedTotal);
          squares[i + 1].className = 'tile';
          score += combinedTotal;
          scoreDisplay.innerHTML = 'Score: ' + score;
        }
      }
    }
  }

  // Combine column
  function combineColumn() {
    for (let i = 0; i < 12; i++) {
      if (squares[i].innerHTML === squares[i + 4].innerHTML && squares[i].innerHTML !== '') {
        let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + 4].innerHTML);
        squares[i].innerHTML = combinedTotal;
        squares[i + 4].innerHTML = '';
        squares[i].className = 'tile';
        squares[i].classList.add('tile-' + combinedTotal);
        squares[i + 4].className = 'tile';
        score += combinedTotal;
        scoreDisplay.innerHTML = 'Score: ' + score;
      }
    }
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

  function keyRight() {
    moveRight();
    combineRow();
    moveRight();
    generateNewTile();
    checkForWin();
    checkForGameOver();
  }

  function keyLeft() {
    moveLeft();
    combineRow();
    moveLeft();
    generateNewTile();
    checkForWin();
    checkForGameOver();
  }

  function keyDown() {
    moveDown();
    combineColumn();
    moveDown();
    generateNewTile();
    checkForWin();
    checkForGameOver();
  }

  function keyUp() {
    moveUp();
    combineColumn();
    moveUp();
    generateNewTile();
    checkForWin();
    checkForGameOver();
  }

  // Check for win
  function checkForWin() {
    if (squares.some(square => square.innerHTML == 2048)) {
      alert('You Win!');
      document.removeEventListener('keydown', control);
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
      }
    }
  }

});
