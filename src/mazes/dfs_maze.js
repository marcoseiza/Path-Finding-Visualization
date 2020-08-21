let prevDiagonal = false;

export function setup(canvas) {
  // Make the grid odd or big enough to look good
  canvas.r = (canvas.r == 40)? 39: (canvas.r < 5)? 5: canvas.r + 1 - (canvas.r % 2);
  canvas.c = (canvas.c == 40)? 39: (canvas.c < 5)? 5: canvas.c + 1 - (canvas.c % 2);

  canvas.open = [];
  canvas.path = [];
  canvas.path.push(canvas.blocks[Math.floor(random(1, canvas.r - 1) / 2) * 2 + 1][Math.floor(random(1, canvas.c - 1) / 2) * 2 + 1])
  canvas.closed = [];

  if (canvas.diagonal) {
    prevDiagonal = canvas.diagonal;
    canvas.diagonal = false;
  }

  for(let i = 0; i < canvas.r; i++) {
    for(let j = 0; j < canvas.c; j++) {
      canvas.blocks[i][j].trans = false;
      canvas.blocks[i][j].wall = true;

      canvas.blocks[i][j].visited = false;
      if (i == 0 || j == 0 || i == canvas.r - 1 || j == canvas.c - 1) 
        canvas.blocks[i][j].visited = true;
      if (i % 2 == 0 && j % 2 == 0) 
        canvas.blocks[i][j].visited = true;
    }
  }
}

export function algo(canvas) {
  if (canvas.path.length > 0) {
    let current = canvas.path.pop();
    current.wall = false;
    current.visited = true;

    let neighbors = [];

    if (current.x % 2 == 1 && current.y % 2 == 1) {
      for (let i = 0; i < current.neighbors.length; i++) {
        let deadEnd = true;
        if (!current.neighbors[i].visited) {
          for (let j = 0; j < current.neighbors[i].neighbors.length; j ++) {
            if (!current.neighbors[i].neighbors[j].visited) {
              deadEnd = false;
            }
          }
          if (!deadEnd) {
            neighbors.push(current.neighbors[i]);
          }
        }
      }
    } else {
      for (let i = 0; i < current.neighbors.length; i++) {
        if (!current.neighbors[i].visited) {
          neighbors.push(current.neighbors[i]);
        }
      }
    }
    
    if (neighbors.length > 0) {
      canvas.path.push(current);
    } else {
      canvas.open.pushBlock(current);
    }

    let next = neighbors[Math.floor(random(0, neighbors.length))];

    if (next) {
      canvas.path.push(next);
    }

    
    return true
  } else {
    canvas.path = [];
    canvas.open = [];
    for(let i = 0; i < canvas.r; i++) {
      for(let j = 0; j < canvas.c; j++) {
        canvas.blocks[i][j].trans = true;
      }
    }
    if (prevDiagonal)
      canvas.diagonal = true;
    return false
  }
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}