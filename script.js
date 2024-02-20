



const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;
const TETROMINO_NAMES = [
    'I',
    'O',
    'T',
    'J',
    'L',
    'S',
    'Z'
];

const TETROMINOES = {
    'I': [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    'O': [[1, 1], [1, 1]],
    'T': [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0]
    ],
    'J': [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
    ],
    'L': [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
    ],
    'S': [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    'Z': [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ]
};

function convertPositionToIndex(row, column) {
    return row * PLAYFIELD_COLUMNS + column;
}

let playfield;
let tetromino;

function generatePlayField() {
    // 
    for(let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i++){
        const div = document.createElement(`div`);
        document.querySelector('.grid').append(div);
    }

    playfield = new Array(PLAYFIELD_ROWS).fill()
                    .map( ()=> new Array(PLAYFIELD_COLUMNS).fill(0) )
    // console.table(playfield);
}

function generateTetromino() {
    // 
    const random = Math.floor(Math.random() * TETROMINO_NAMES.length);

    const name = TETROMINO_NAMES[random];
    const matrix = TETROMINOES[name];

    const row = name === 'I' ? -1 : 0;
    const column =
    ['T', 'J', 'S'].includes(name)
    ? playfield[0].length / 2 - Math.floor(matrix[0].length / 2)
    : playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);

    // console.log(matrix);
    tetromino = {
        name,
        matrix,
        row,
        column,

    }
}

generatePlayField();
generateTetromino();

const cells = document.querySelectorAll('.grid div');

function drawPlayField() {
    // 
    for(let row = 0; row < PLAYFIELD_ROWS; row++){
        for(let column = 0; column < PLAYFIELD_COLUMNS; column++){
            if(playfield[row][column] == 0) continue;
            
            const name = playfield[row][column];
            const cellIndex = convertPositionToIndex(row,column);
            // console.log(cellIndex);
            cells[cellIndex].classList.add(name);
        }
    }
}

function drawTetromino() {
    // 
    const name = tetromino.name;
    const tetrominoMatrixSize = tetromino.matrix.length;
    
    for(let row = 0; row < tetrominoMatrixSize; row++){
        for(let column = 0; column < tetrominoMatrixSize; column++){
            if(!tetromino.matrix[row][column]) continue;
            const cellIndex = convertPositionToIndex(
                tetromino.row + row,
                tetromino.column + column
            );
            // console.log(cellIndex);
            cells[cellIndex].classList.add(name);
        }
        // column
    }
    // row
}

// New function for rotating tetrominos:
function rotateTetromino() {
    // Create a temporary rotation matrix to perform the rotation
    const rotatedMatrix = [];
    for (let col = 0; col < tetromino.matrix[0].length; col++) {
        rotatedMatrix.push([]);
        for (let row = tetromino.matrix.length - 1; row >= 0; row--) {
            rotatedMatrix[col].push(tetromino.matrix[row][col]);
        }
    }

    // Check for collisions after rotation
    let canRotate = true;
    for (let row = 0; row < rotatedMatrix.length; row++) {
        for (let col = 0; col < rotatedMatrix[0].length; col++) {
            if (
                rotatedMatrix[row][col] === 1 &&
                (tetromino.row + row >= PLAYFIELD_ROWS ||
                    tetromino.column + col >= PLAYFIELD_COLUMNS ||
                    playfield[tetromino.row + row][tetromino.column + col] === 1)
            ) {
                canRotate = false;
                break;
            }
        }
        if (!canRotate) {
            break;
        }
    }

    // If rotation is possible, update the tetromino matrix and position
    if (canRotate) {
        tetromino.matrix = rotatedMatrix;

        // Adjust position after rotation to prevent tetromino going off-grid
        if (tetromino.column + tetromino.matrix[0].length >= PLAYFIELD_COLUMNS) {
            tetromino.column -= tetromino.matrix[0].length - 1;
        }
    }
}

// drawTetromino();
// drawPlayField();

function draw() {
    // 
    cells.forEach(cell => cell.removeAttribute('class'));
    drawPlayField();
    drawTetromino();
}

draw();

document.addEventListener('keydown', onKeyDown);

function onKeyDown(e) {
    switch (e.key) {
        // 
        case 'ArrowDown':
            moveTetrominoDown();
            break;
        case 'ArrowLeft':
            moveTetrominoLeft();
            break;
        case 'ArrowRight':
            moveTetrominoRight();
            break;
        case 'ArrowUp':
            rotateTetromino();
            break;
    }

    draw();
}

function moveTetrominoDown() {
    // 
    tetromino.row += 1;
}

function moveTetrominoLeft() {
    // 
    tetromino.column -= 1;
}

function moveTetrominoRight() {
    // 
    tetromino.column += 1;
}

// Add event listener for 'ArrowUp' key press to rotate tetromino
document.addEventListener('keydown', onKeyDown);

// Start the game loop
setInterval(draw, 1000);
