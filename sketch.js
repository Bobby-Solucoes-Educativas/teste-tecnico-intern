const PANEL_SIZE = 30;

let canvasSize = 600;
let gridSize = 100;
let paused = true;
let present = new Array(); // Grid contendo o instante atual de tempo
let panel, pauseButton, resetButton, gridSizeInput; // Elementos de controle

function setupGrid(size) {
  // Retorna um novo grid
  const grid = Array.from({ length: size }, () => Array(size).fill(0));
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      grid[i][j] = round(random());
    }
  }
  return grid;
}

function setup() {
  // Inicializando o canvas
  const cnv = createCanvas(canvasSize, canvasSize);
  cnv.parent('canvas_container');
  present = setupGrid(gridSize);

  panel = createDiv();
  panel.parent('canvas_container');
  panel.style('background', '#000');
  panel.style('display', 'flex');
  panel.style('align-items', 'stretch');

  pauseButton = createButton('PLAY');
  pauseButton.style('display', 'block');
  pauseButton.parent(panel);
  pauseButton.mousePressed(playPause);

  resetButton = createButton('RESET');
  resetButton.style('display', 'block');
  resetButton.parent(panel);
  resetButton.mousePressed(reset);

  const sizeLabel = createDiv('Grid Size: &nbsp;');
  sizeLabel.style('display', 'block');
  sizeLabel.parent(panel);
  sizeLabel.style('color', 'white');
  sizeLabel.style('display', 'flex');
  sizeLabel.style('align-items', 'center');
  sizeLabel.style('margin-left', '10px');

  gridSizeInput = createInput('100');
  gridSizeInput.style('display', 'block');
  gridSizeInput.parent(panel);
}

function draw() {
  // Loop principal (Chamado infinitamente)
  background(0);
  strokeWeight(0);

  const future = setupGrid(gridSize);

  if (gridSize != present.length) {
    present = setupGrid(gridSize);
  }

  for (let j = 0; j < gridSize; j++) {
    for (let i = 0; i < gridSize; i++) {
      computeCell(i, j, present, future);
      drawCell(i, j, present);
    }
  }

  if (!paused) present = future;
  computeCanvasSize();
  updatePanel();
}

/** 
  Manipula a célula especificada seguindo as regras do jogo da vida levando
  analisando presente e ditando como ela estará no futuro.
*/
function computeCell(i, j, present, future) {
  const neighborCount = countNeighbors(i, j, present);
  const cellLife = cell(i, j, present);

  future[i][j] = cell(i, j, present);

  if (cellLife === 1 && (neighborCount === 2 || neighborCount === 3)) {
    future[i][j] = 1;
  }

  if (cellLife === 1 && neighborCount < 2) future[i][j] = 0;
  if (cellLife === 1 && neighborCount > 3) future[i][j] = 0;
  if (cellLife === 0 && neighborCount === 3) future[i][j] = 1;
}

function drawCell(i, j, grid) {
  // Desenha o grid
  let cellSize = canvasSize / gridSize;

  if (cell(i, j, grid) === 1) {
    fill(255);
    rect(i * cellSize, j * cellSize, cellSize, cellSize);
  }
}

function cell(i, j, grid) {
  // Retorna a célula do grid na posição especificada
  if (grid[abs(i) % gridSize] !== undefined) {
    return grid[abs(i) % gridSize][abs(j) % gridSize];
  }
  return 0;
}

function countNeighbors(i, j, grid) {
  // Conta quantas células vivas existem em volta da célula especificada
  let count = 0;

  if (cell(i - 1, j - 1, grid) === 1) count++;
  if (cell(i - 1, j, grid) === 1) count++;
  if (cell(i - 1, j + 1, grid) === 1) count++;
  if (cell(i, j + 1, grid) === 1) count++;
  if (cell(i + 1, j + 1, grid) === 1) count++;
  if (cell(i + 1, j, grid) === 1) count++;
  if (cell(i + 1, j - 1, grid) === 1) count++;
  if (cell(i, j - 1, grid) === 1) count++;
  return count;
}

function mousePressed() {
  // Define a célula clicada como viva ao clicar
  const gridPosX = int((mouseX / canvasSize) * gridSize);
  const gridPosY = int((mouseY / canvasSize) * gridSize);
  setPresentAliveCell(gridPosX, gridPosY);
}

function mouseDragged() {
  // Define a célula clicada como viva ao arrastar
  const gridPosX = int((mouseX / canvasSize) * gridSize);
  const gridPosY = int((mouseY / canvasSize) * gridSize);
  setPresentAliveCell(gridPosX, gridPosY);
}

function setPresentAliveCell(i, j) {
  // Define a célula especificada como viva no presente
  if (i < gridSize && j < gridSize && i >= 0 && j >= 0) {
    present[i][j] = 1;
  }
}

function computeCanvasSize() {
  // Altera o tamanho do canvas
  if (height != canvasSize) {
    resizeCanvas(canvasSize, canvasSize);
  }

  canvasSize = min(innerHeight - PANEL_SIZE, innerWidth);
}

function updatePanel() {
  panel.size(canvasSize, PANEL_SIZE);
  pauseButton.html(paused ? 'PLAY' : 'PAUSE');
  if (int(gridSizeInput.value()) >= 10) gridSize = int(gridSizeInput.value());
}

function reset() {
  // Reinicia e pausa
  present = setupGrid(gridSize);
  paused = true;
}

function playPause() {
  paused = !paused;
}
