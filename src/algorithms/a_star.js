export function setup(canvas) {
  canvas.open = [canvas.startBlock];
  canvas.closed = [];
  canvas.path = [];

  for (let i = 0; i < canvas.r; i++) {
    for (let j = 0; j < canvas.c; j++) {
      canvas.blocks[canvas.index(i, j)].ha = canvas.calcHa(canvas.blocks[canvas.index(i, j)], canvas.endBlock);
      canvas.blocks[canvas.index(i, j)].ga = 0;
      canvas.blocks[canvas.index(i, j)].fa = Infinity;
      canvas.blocks[canvas.index(i, j)].visited = false;
      canvas.blocks[canvas.index(i, j)].previous = undefined;
    }
  }
}

export function algo(canvas) {
  console.log(canvas.endBlock.visited, canvas.endBlock);
  
  if (canvas.open.length > 0) {
    canvas.sortBlocks();

    let current = canvas.open[0];

    if (current.end) {
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

    canvas.open.shiftBlock();
    canvas.closed.pushBlock(current);
    current.visited = true;

    for (let i = 0; i < current.neighbors.length; i++) {
      let neighbor = current.neighbors[i];
      if (!neighbor.visited && !neighbor.wall) {
        
        let tentGa = current.ga + canvas.calcHa(neighbor, current)

        if (!canvas.open.includes(neighbor)) {
          canvas.open.pushBlock(neighbor)
        } else if (tentGa >= neighbor.ga) {
          continue
        }
        
        neighbor.ga = tentGa;
        neighbor.fa = neighbor.ga + neighbor.ha;
        neighbor.previous = current;
      }
    }
    return true;

  } else {
    // no solution
    canvas.successfulAlgo = false;
    canvas.updateAlgo = true;
    return false;
  }
}