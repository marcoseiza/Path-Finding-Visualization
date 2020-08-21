export function setup(canvas) {
  canvas.open = [canvas.startBlock];
  canvas.closed = [];
  canvas.path = [];

  for (let i = 0; i < canvas.r; i++) {
    for (let j = 0; j < canvas.c; j++) {
      canvas.blocks[canvas.index(i, j)].visited = false;
      canvas.blocks[canvas.index(i, j)].previous = undefined;
    }
  }
}

export function algo(canvas) {
  if (canvas.open.length > 0) {

    let current = canvas.open[0];

    if (current == canvas.endBlock) {
      
      if (canvas.path.length == 0)
        canvas.path.pushBlock(current);

      let temp = canvas.path[0];

      if (temp.previous) {
        canvas.path.unshiftBlock(temp.previous);
        return true
      } else {
        canvas.updateAlgo = true;
        return false
      }
    }

    canvas.open.shiftBlock()
    canvas.closed.pushBlock(current);
    current.visited = true;

    for (let i = 0; i < current.neighbors.length; i++) {
      let neighbor = current.neighbors[i];
      if (!neighbor.visited && !neighbor.wall && !canvas.open.includes(neighbor)) {
        canvas.open.pushBlock(neighbor);
        neighbor.previous = current;
      }
    }
    return true
  } else {
    // no solution
    canvas.successfulAlgo = false;
    canvas.updateAlgo = true;
    return false
  }
}