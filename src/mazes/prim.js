let prevDiagonal = false;

export function setup(canvas) {
  // Make the grid odd or big enough to look good
  canvas.r = (canvas.r == 40)? 39: (canvas.r < 5)? 5: canvas.r + 1 - (canvas.r % 2);
  canvas.c = (canvas.c == 40)? 39: (canvas.c < 5)? 5: canvas.c + 1 - (canvas.c % 2);

  canvas.open = [];
  canvas.path = [];
  canvas.closed = [];

  if (canvas.diagonal) {
    prevDiagonal = canvas.diagonal;
    canvas.diagonal = false;
  }

  for(let i = 0; i < canvas.r; i++) {
    for(let j = 0; j < canvas.c; j++) {
      canvas.blocks[canvas.index(i, j)].trans = false;
      canvas.blocks[canvas.index(i, j)].wallNoTrans(true);

      canvas.blocks[canvas.index(i, j)].visited = false;
      if ((i % 2 == 0 && j % 2 == 0) || i == 0 || j == 0 || i == canvas.r - 1 || j == canvas.c - 1) 
        canvas.blocks[canvas.index(i, j)].visited = true;
    }
  }

  let random_i = Math.floor((Math.random() * (canvas.r - 2) + 1) / 2) * 2 + 1,
      random_j = Math.floor((Math.random() * (canvas.c - 2) + 1) / 2) * 2 + 1,
      first_block = canvas.blocks[canvas.index(random_i, random_j)];

  for (let i = 0; i < first_block.neighbors.length; i++) {
    canvas.path.push(first_block.neighbors[i]);
  }
}

export function algo(canvas) {
  if (canvas.path.length > 0) {
    let rand_i = Math.floor(Math.random() * canvas.path.length),
        current_edge = canvas.path.splice(rand_i, 1)[0];

    // Define valid cells in the grid
    // cell  edge  cell
    // []     |     []
    // edge is a block
    let cells = [];
    for (let i = 0; i < current_edge.neighbors.length; i++) {
      if (!current_edge.neighbors[i].visited)
        cells.push(current_edge.neighbors[i]);
    }

    // Algo logic
    if (cells.length >= 1) {
      current_edge.wallNoTrans(false);

      for (let i = 0; i < cells.length; i++) {
        cells[i].wallNoTrans(false);
        if (!cells[i].visited) {
          for (let j = 0; j < cells[i].neighbors.length; j++) {
            canvas.path.push(cells[i].neighbors[j]);
          }
        }
        cells[i].visited = true;
      }
    }

    return true

  } else {
    canvas.path = [];
    canvas.open = [];
    for(let i = 0; i < canvas.r; i++) {
      for(let j = 0; j < canvas.c; j++) {
        canvas.blocks[canvas.index(i, j)].trans = true;
      }
    }
    if (prevDiagonal)
      canvas.diagonal = true;
    return false
  }
}