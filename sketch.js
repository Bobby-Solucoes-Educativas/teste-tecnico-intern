const PANEL_SIZE = 30;
const CANVAS_MARGIN = 50;

let canvasSize = 600;
let gridSize = 100;
let paused = false;
let present = new Array(); // Grid contendo o instante atual de tempo
let panel, pauseButton, resetButton, gridSizeInput; // Elementos de controle

let pattern = 0;

function setupGrid(size) {
  // Retorna um novo grid
  return Array.from({ length: size }, () => Array(size).fill(0));
}

function setup() {
  // Inicializando o canvas e os controles
  const cnv = createCanvas(canvasSize, canvasSize);
  cnv.parent('canvas_container');
  present = setupGrid(gridSize);

  for (let j = 0; j < gridSize; j++) {
    for (let i = 0; i < gridSize; i++) {
      present[i][j] = round(random() * 0.6);
    }
  }

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

  canvasSize = min(innerHeight - PANEL_SIZE, innerWidth) - CANVAS_MARGIN;
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

function setPattern(index) {
  // Desenha um padrão da lista no indice especificado
  reset();
  PATTERNS[index].forEach((item) => {
    setPresentAliveCell(gridSize / 2 + item[0], gridSize / 2 + item[1]);
  });
  playPause();
}

function mouseWheel() {
  setPattern(pattern % PATTERNS.length);
  pattern++;
}

// prettier-ignore
const PATTERNS = [ // Padrões predefinidos
  [[0, 1], [1, 3], [2, 0], [2, 1], [2, 4], [2, 5], [2, 6]],
  [[0, 6], [1, 0], [1, 1], [2, 1], [2, 5], [2, 6], [2, 7]],
  [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7],
    [0, 9], [0, 10], [0, 11], [0, 12], [0, 13],
    [0, 17], [0, 18], [0, 19],
    [0, 26], [0, 27], [0, 28], [0, 29], [0, 30], [0, 31],
    [0, 33], [0, 34], [0, 35], [0, 36], [0, 37]],
  [[0, 6], [1, 4], [1, 6], [1, 7], [2, 4], [2, 6], [3, 4], [4, 2], [5, 0], [5, 2]],
  [[-1, 0], [-1, 1], [0, -1], [0, 0], [1, 0]],
  [[-1, 0], [0, 1], [1, -1], [1, 0], [1, 1]],
  [[-1, -1], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 1], [2, 0]],
  [[-2, -1], [-2, 0], [-2, 1], [-2, 2], [-1, -2], [-1, 2], [0, 2], [1, -2], [1, 1]],
  [[0, -4], [0, -3], [0, -2], [0, -1], [0, 0], [0, 1], [0, 2], [0, 3], [0, 4],[0, 5]],
  [[0, -18], [0, -17], [1, -18], [1, -17], [0, -8], [1, -8], [2, -8], [-1, -7],
    [-2, -6], [-2, -5], [3, -7], [4, -6], [4, -5], [1, -4], [-1, -3], [0, -2], [1, -2],
    [2, -2], [1, -1], [3, -3], [-2, 2], [-1, 2], [0, 2], [-2, 3], [-1, 3], [0, 3], [-3, 4],
    [1, 4], [-4, 6], [-3, 6], [1, 6], [2, 6], [-2, 16], [-1, 16], [-2, 17], [-1, 17]],
  [[-3, -9], [-3, -8], [-3, -7], [-3, 5], [-3, 6], [-3, 7], [-2, -10], [-2, -7],
    [-2, 4], [-2, 7], [-1, -7], [-1, -2], [-1, -1], [-1, 0], [-1, 7], [0, -7], [0, -2], [0, 1],
    [0, 7], [1, -8], [1, -3], [1, 6]],
];
