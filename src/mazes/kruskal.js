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

      canvas.blocks[canvas.index(i, j)].previous = canvas.blocks[canvas.index(i, j)];

      canvas.blocks[canvas.index(i, j)].visited = false;
      if ((i % 2 == 0 && j % 2 == 0) || i == 0 || j == 0 || i == canvas.r - 1 || j == canvas.c - 1) {
        canvas.blocks[canvas.index(i, j)].visited = true;
      } else if (i % 2 != j % 2) {
        canvas.path.push(canvas.blocks[canvas.index(i, j)])
      }  
    }
  }

  for (let i = canvas.path.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [canvas.path[i], canvas.path[j]] = [canvas.path[j], canvas.path[i]];
  }

}

export function algo(canvas) {
  if (canvas.path.length > 0) {
    let current_edge = canvas.path.pop();

    let neighbors = [];

    for (let i = 0; i < current_edge.neighbors.length; i++) {
      if (!current_edge.neighbors[i].visited) {
        neighbors.push(current_edge.neighbors[i]);
      }
    }

    if (union(neighbors[0], neighbors[1])) {
      neighbors[0].wall = false;
      neighbors[1].wall = false;
      current_edge.wall = false;
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

function shuffleArray(array) {
  
}

function find(x) {
  if (x.previous != x)
     x.previous = find(x.previous)
  return x.previous
}

function union(x, y) {
  let xRoot = find(x),
      yRoot = find(y);

  if (xRoot == yRoot) {
    return false
  }

  yRoot.previous = xRoot;
  return true;
}