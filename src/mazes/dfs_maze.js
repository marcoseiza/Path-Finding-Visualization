function dfsMaze() {
  // console.log(mazeStack);
  if (mazeStack.length > 0) {
    let current = mazeStack.pop();
    current.wall = false;
    current.visited = true;

    let neighbors = [];

    if (current.i % 2 == 1 && current.j % 2 == 1) {
      for (let i = 0; i < current.neighbors.length; i++) {
        let deadEnd = true;
        if (!current.neighbors[i].visited) {
          for (let j = 0; j < current.neighbors[i].neighbors.length; j ++) {
            if (!current.neighbors[i].neighbors[j].visited) {
              deadEnd = false;
            }
          }
          if (!deadEnd) {
            neighbors.push(current.neighbors[i])
          }
        }
      }
    } else {
      for (let i = 0; i < current.neighbors.length; i++) {
        if (!current.neighbors[i].visited) {
          neighbors.push(current.neighbors[i])
        }
      }
    }
    
    if (neighbors.length > 0) {
      mazeStack.push(current)
    } else {
      current.color = color(0, 200, 0)
    }

    let next = random(neighbors)

    if (next) {
      mazeStack.push(next)
    }

    
    return true
  } else {
    console.log('finished')
    for (let i = 0; i < columns; i ++) {
      for (let j = 0; j < rows; j ++) {
        blocks[i][j].color = color(197, 181, 148)
      }
    }
    return false
  }
}