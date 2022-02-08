/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;
let gameOver = false;

let currPlayer = 1; // active player: 1 or 2
// ????? why not simply make the board here, rather than create a function to do it later?????
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

let makeBoard = () => {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  for (let i = 0; i < HEIGHT; i++) { board.push(Array(WIDTH).fill(null)) }

  // below is early effort to make board, resulted in board being 3 arrays.
  // board.push([...Array(HEIGHT)].map(() => Array(WIDTH).fill(null)))
}

/** makeHtmlBoard: make HTML table and row of column tops. */

let makeHtmlBoard = () => {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  let htmlBoard = document.getElementById("board");
  // TODO: add comment for this code
  // creates a row which will house the top row "buttons", 
  // which when pressed will drop the player's peice
  let top = document.createElement("tr");
  // sets the id attribut of the top row to "column-top"
  top.setAttribute("id", "column-top");
  // adds the event listener, which will function as the button players press
  top.addEventListener("click", handleClick);

  // creates a td element for each column with id attribute set to its column number, then appends
  // that td element to the top element we just created
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  // appends the top element we just created to the htmlBoard we created earlier in the function
  htmlBoard.append(top);

  // TODO: add comment for this code
  // creates a td element for every square on the board with an id attribute of its coordinates on
  // the board, 'x-y'.
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      // each td is appended to the appropriate row.......
      row.append(cell);
    }
    // .......and then each row is appended to the board.
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

let findSpotForCol = (x) => {
  // TODO: write the real version of this, rather than always returning 0

  for (let i = HEIGHT - 1; i >= 0; i = i - 1)   if (board[i][x] === null) return i
}

/** placeInTable: update DOM to place piece into HTML table of board */

let placeInTable = (y, x) => {
  // TODO: make a div and insert into correct table cell
  (elem = document.createElement("div")).setAttribute("class", "piece");
  elem.setAttribute("class", `_${currPlayer}`);
  let myCell = document.getElementById(`${y}-${x}`)
  myCell.append(elem)
  /* couldnt give the div two classes through js, so i just put the piece class components in both players' class */

}

/** endGame: announce game end */

let endGame = (msg) => {
  gameOver = true;
  // TODO: pop up alert message
  alert(msg)
}

/** handleClick: handle click of column top to play piece */

let handleClick = (evt) => {
  // couldn't kill event listener on handleClick, so i set the endGame to run at the beginning to 
  // interrupt the rest of the function.
  evt.preventDefault()
  if (!gameOver) {

    // get x from ID of clicked cell
    let x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    let y = findSpotForCol(x);
    if (!y) {
      return;
    }

    // ????? from time to time i get the following error:
    // connect4.js:121 Uncaught TypeError: Cannot set properties of undefined (setting 'NaN')
    // at HTMLTableRowElement.handleClick (connect4.js:120:15)
    // ????? particularly if i am clicking fast. how can i prevent this?

    board[y][x] = currPlayer;
    // place piece in board and add to HTML table
    // TODO: add line to update in-memory board
    placeInTable(y, x);

    if (checkForTie()) {
      return endGame("the game is over, it's a tie!!")
    }
    // check for win
    if (checkForWin()) {
      return endGame(`Player ${currPlayer} won!`);
    }
    // ????? the last piece doesnt show up until after i click the final message, whats a 
    // ????? good way of avoiding this
    // check for tie
    // TODO: check if all cells in board are filled; if so call, call endGame



    // switch players
    // TODO: switch currPlayer 1 <-> 2
    currPlayer = (currPlayer === 1 ? 2 : 1)
  }
}

// checkForTie will check if every cell on the board is filled and return True if it is
let checkForTie = () => {
  return !board.some(
    (rowArray) => { return rowArray.includes(null) }
  )
}



/** checkForWin: check board cell-by-cell for "does a win start here?" */

let checkForWin = () => {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }



  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
