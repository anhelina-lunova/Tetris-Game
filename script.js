// 1. Додати нові фігури
// 2. Стилізувати нові фігури
// 3. Додати функцію рандому котра буде поветати випадкову фігуру
// 4. Центрувати фігуру незалежно від ширини

// 5. Поставити const rowTetro = -2; прописати код щоб працювало коректно
// 6. Зверстати поле для розрахунку балів гри
// 7. Прописати логіку і код розрахунку балів гри (1 ряд = 10; 2 ряди = 30; 3 ряди = 50; 4 = 100)
// 8. Реалізувати самостійний рух фігур до низу

// 9.Зробити розмітку висновків гри (Час гри, набрана кількість балів і т.п)
// 10.Створити окрему кнопку рестарт що перезапускатиме гру посеред гри
// 11. Додати клавіатуру на екрані браузеру 

// 12.Показувати наступну фігуру що буде випадати
// 13.Додати рівні при котрих збільшується швидкість падіння фігур
// 14.Зберегти і виводити найкращий власний результат

const PLAYFIELD_COLUMNS  = 10;
const PLAYFIELD_ROWS     = 20;
const TETROMINO_NAMES    = ['I', 'O', 'T', 'J', 'L', 'S', 'Z']
const TETROMINOES = {
    'I': [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    'O': [[1,1],[1,1]],
    'T': [[1,1,1],[0,1,0],[0,0,0]],
    'J': [[0,1,0],[0,1,0],[1,1,0]],
    'L': [[0,1,0],[0,1,0],[0,1,1]],
    'S': [[0,1,1],[1,1,0],[0,0,0]],
    'Z': [[1,1,0],[0,1,1],[0,0,0]]
};

const gridElement        = document.querySelector('.grid');

const overlay            = document.querySelector('.overlay');
const controlers         = document.querySelector('.controlers');
const btnLeft            = document.querySelector('.btn-left');
const btnDown            = document.querySelector('.btn-down');
const btnRight           = document.querySelector('.btn-right');
const btnDrop            = document.querySelector('.btn-drop');
const btnRotate          = document.querySelector('.btn-rotate');
const btnRestart         = document.querySelectorAll('.btn-restart');
const btnPlay            = document.querySelector('.btn-play');
const btnPause           = document.querySelector('.btn-pause');
const speedElement       = document.getElementById('speed');
const linesElement       = document.getElementById('lines');
const scoreElement       = document.getElementById('score');
const hiScoreElement     = document.getElementById('hi-score');
const timeElement        = document.getElementById('time');

let isPaused             = false;
let isGameOver           = false;
let moveDownIntervalId   = null;
let moveDownSpeed        = 1000; // milliseconds
let score                = 0;
let deletedRowsCount     = 0;

let playfield;
let tetromino;
let cells;

init();

function init(){
    score = 0;
    deletedRowsCount = 0;
    scoreElement.innerHTML = 0;
    linesElement.innerHTML = 0;
    isGameOver = false;
    generatePlayField();
    generateTetromino(); 
    cells = Array.from({ length: PLAYFIELD_ROWS * PLAYFIELD_COLUMNS }, () => document.createElement('div'));
    cells.forEach(cell => gridElement.appendChild(cell));
    startAutoMoveDown();
}

function generatePlayField(){
    playfield = Array.from({ length: PLAYFIELD_ROWS }, () => Array(PLAYFIELD_COLUMNS).fill(0));
}

function generateTetromino(){
    const name = getRandomElement(TETROMINO_NAMES);
    const matrix = TETROMINOES[name];

    const row = ['J', 'L'].includes(name) ? -3 : -2;
    const column =
    ['T', 'J', 'S'].includes(name)  // T - ?
    ? PLAYFIELD_COLUMNS / 2 - Math.floor(matrix.length / 2)
    : PLAYFIELD_COLUMNS / 2 - Math.ceil(matrix.length / 2);

    // console.log(matrix);
    tetromino = {
        name,
        matrix,
        row,
        column,
    }
}

function convertPositionToIndex(row, column){
    return row * PLAYFIELD_COLUMNS + column;
}

function getRandomElement(array){
    const randomIndex = Math.floor(Math.random() * array.length)
    return array[randomIndex]
}

function removeFullRows() {
    let rowsCleared = 0;

    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
        if (playfield[row].every(cell => cell !== 0)) {
            playfield.splice(row, 1);
            playfield.unshift(new Array(PLAYFIELD_COLUMNS).fill(0));
            rowsCleared++;
            deletedRowsCount++;
        }
    }

    switch (rowsCleared) {
        case 1:
            score += 10;
            break;
        case 2:
            score += 30;
            break;
        case 3:
            score += 50;
            break;
        case 4:
            score += 100;
            break;
    }

    scoreElement.innerHTML = `${score}`;
    linesElement.innerHTML = `${deletedRowsCount}`;

}

function placeTetromino(){
    const matrixSize = tetromino.matrix.length;
    for(let row = 0; row < matrixSize; row++){
        for(let column = 0; column < matrixSize; column++){
            if(isOutsideOfTopboard(row)){
                isGameOver = true;
                return;
            }
            if(tetromino.matrix[row][column]){
                playfield[tetromino.row + row][tetromino.column + column] = tetromino.name;
            }
        }
    }
    removeFullRows();
    generateTetromino();
}

function drawPlayField() {
    playfield.forEach((row, rowIndex) => {
        row.forEach((cell, columnIndex) => {
            if (cell == 0) {
                cells[rowIndex * PLAYFIELD_COLUMNS + columnIndex].className = '';
            } else {
                cells[rowIndex * PLAYFIELD_COLUMNS + columnIndex].className = cell;
            }
        });
    });
}

function drawTetromino(){
    const name = tetromino.name;
    const tetrominoMatrixSize = tetromino.matrix.length;
    
    tetromino.matrix.forEach((row, rowIndex) => {
        row.forEach((cell, columnIndex) => {
            if (isOutsideOfTopboard(rowIndex)) return;
            if (!cell) return;
            cells[(tetromino.row + rowIndex) * PLAYFIELD_COLUMNS + (tetromino.column + columnIndex)].className = name;
        });
    });
}
// drawTetromino();
// drawPlayField();

function draw(){
    drawPlayField();
    drawTetromino();
}

draw();

function rotate(){
    rotateTetromino();
    draw();
}

document.addEventListener('keydown', onKeyDown);

function onKeyDown(e){
    if(e.key == 'Escape'){
        togglePauseGame();
    }
    if(!isPaused){
        switch(e.key){
            case ' ':
                dropTetrominoDown();
                break;
            case 'ArrowUp':
                rotateTetromino();
                break;
            case 'ArrowDown':
                moveTetrominoDown();
                break;
            case 'ArrowLeft':
                moveTetrominoLeft();
                break;
            case 'ArrowRight':
                moveTetrominoRight();
                break;
        }
    }
    draw();
}

function rotateMatrix(matrixTetromino){
    const N = matrixTetromino.length;
    const rotateMatrix = [];
    for(let i = 0; i < N; i++){
        rotateMatrix[i] = [];
        for(let j = 0; j < N; j++){
            rotateMatrix[i][j] = matrixTetromino[N - j - 1][i];
        }
    }
    return rotateMatrix;
}

document.getElementById("pauseModal").addEventListener("click", function() {
    if (isPaused && !isGameOver) {
        togglePauseGame();
    }
});

document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === 'hidden') {
        if (!isPaused && !isGameOver) {
            togglePauseGame();
        }
    }
});

btnLeft.addEventListener('click', moveTetrominoLeft);
btnDown.addEventListener('click', moveTetrominoDown);
btnRight.addEventListener('click', moveTetrominoRight);
btnDrop.addEventListener('click', dropTetrominoDown);
btnRotate.addEventListener('click', rotateTetromino);
btnRestart.forEach(button => {
    button.addEventListener('click', function() {
        document.querySelector('.grid').innerHTML = '';
        overlay.style.display = 'none';
        init();
        this.blur();
    });
});
btnPause.addEventListener('click', togglePauseGame);

function moveTetrominoLeft(){
    if(isPaused){
        return null;
    }
    tetromino.column -= 1;
    if(!isValid()){
        tetromino.column += 1;
    }
    draw();
    this.blur();
}

function moveTetrominoDown(){
    if(isPaused){
        return null;
    }
    tetromino.row += 1;
    if(!isValid()){
        tetromino.row -= 1;
        placeTetromino();
        updateSpeed();
    }
    draw();
    this.blur();
}

function moveTetrominoRight(){
    if(isPaused){
        return null;
    }
    tetromino.column += 1;
    if(!isValid()){
        tetromino.column -= 1;
    }
    draw();
    this.blur();
}

function dropTetrominoDown(){
    if(isPaused){
        return null;
    }
    while(isValid()){
        tetromino.row++;
    }
    tetromino.row--;

    this.blur();
}

function rotateTetromino(){
    if(isPaused){
        return null;
    }
    const oldMatrix = tetromino.matrix;
    const rotatedMatrix = rotateMatrix(tetromino.matrix);
    // showRotated = rotateMatrix(showRotated);
    tetromino.matrix = rotatedMatrix;
    if(!isValid()){
        tetromino.matrix = oldMatrix;
    }
    draw();
    this.blur();
}

// let showRotated = [
//     [1, 2, 3],
//     [4, 5, 6],
//     [7, 8, 9]
// ]

function togglePauseGame(){
    if(isPaused === false){
        stopAutoMoveDown();
        document.getElementById("pauseModal").style.display = 'block'; // Відображення модального вікна
    } else {
        startAutoMoveDown();
        document.getElementById("pauseModal").style.display = 'none'; // Приховання модального вікна
    }
    isPaused = !isPaused;
    this.blur();
}

function startAutoMoveDown() {
    if(!moveDownIntervalId){
        moveDownIntervalId = setInterval(() => {
            moveTetrominoDown();
            updateSpeed();
            draw();
            if(isGameOver){
                gameOver();
            }
        }, moveDownSpeed);
    }
}

function stopAutoMoveDown() {
    clearInterval(moveDownIntervalId);
    moveDownIntervalId = null;
}

function gameOver(){
    stopAutoMoveDown();
    overlay.style.display = 'flex';
}

function isValid(){
    const matrixSize = tetromino.matrix.length;
    for(let row = 0; row < matrixSize; row++){
        for(let column = 0; column < matrixSize; column++){
            // if(tetromino.matrix[row][column]) continue;
            if(isOutsideOfGameboard(row, column)){ return false; }
            if(hasCollisions(row, column)){ return false; }
        }
    }
    return true;
}

function isOutsideOfTopboard(row){
    return tetromino.row + row < 0;
}

function isOutsideOfGameboard(row, column){
    return tetromino.matrix[row][column] &&
    (      
        tetromino.column + column < 0 ||
        tetromino.column + column >= PLAYFIELD_COLUMNS ||
        tetromino.row + row >= PLAYFIELD_ROWS
    );
}

function hasCollisions(row, column){
    return tetromino.matrix[row][column] &&
           playfield[tetromino.row + row]?.[tetromino.column + column];
}

function updateSpeed() {
    const pointsPerSpeedIncrease = 100;
    const speedIncreaseAmount = 1000;

    const currentSpeedElement = parseInt(speedElement.innerHTML);
    const currentScore = parseInt(scoreElement.innerHTML);

    if (currentScore >= pointsPerSpeedIncrease * currentSpeedElement) {
        speedElement.innerHTML = currentSpeedElement + 1;
    }
}