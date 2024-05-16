let canvasSize = 600;
let gridSize = 100;
let present = new Array(); // Grid contendo o instante atual de tempo


function setupGrid(size) { // Retorna um novo grid
  return Array.from({ length: size }, () => Array(size).fill(0));
}

function setup() { // Inicializando o canvas
  const cnv = createCanvas(canvasSize, canvasSize);
  cnv.parent('canvas_container');
  present = setupGrid(gridSize);
}

function draw() { // Loop principal (Chamado infinitamente)
  background(0);
  strokeWeight(0);

  const future = setupGrid(gridSize);

  if (gridSize != present.length) {
    present = setupGrid(gridSize);
  }

  for (let j = 0; j < gridSize; j++) {
    for (let i = 0; i < gridSize; i++) {
      drawCell(i, j, present);
    }
  }

  present = future;
}

function drawCell(i, j, grid) { // Desenha o grid
  let cellSize = canvasSize / gridSize;

  if (cell(i, j, grid) === 1) {
    fill(255);
    rect(i * cellSize, j * cellSize, cellSize, cellSize);
  }
}

function cell(i, j, grid) { // Retorna a célula do grid na posição especificada
  if (grid[abs(i) % gridSize] !== undefined) {
    return grid[abs(i) % gridSize][abs(j) % gridSize];
  }
  return 0;
}