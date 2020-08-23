let down = true;

export function setup(canvas) {  

  for (let i = 0; i < canvas.r; i++) {
    for (let j = 0; j < canvas.c; j++) {
      canvas.blocks[canvas.index(i, j)].trans = false;
      canvas.blocks[canvas.index(i, j)].wall = false;
    }
  }
  
  let max = Math.floor(canvas.r * 0.7),
      min = Math.floor(canvas.r * 0.3),
      randX = Math.floor(random(min, max));

  canvas.path = [];
  canvas.path.push(canvas.blocks[canvas.index(randX,0)])
  canvas.open = [];
  canvas.closed = [];
  down = (Math.random() > 0.5);
}

export function algo(canvas) {
  if (canvas.path.length > 0) {
    let current = canvas.path.pop();
    current.wall = true;

    if (current.y < canvas.c - 2) {
      if (current.x == 1) {
        down = false;
      } else if (current.x == canvas.r - 2) {
        down = true;
      }
  
      if (down) {
        canvas.path.push(canvas.blocks[canvas.index(current.x - 1, current.y + 1)])
      } else {
        canvas.path.push(canvas.blocks[canvas.index(current.x + 1, current.y + 1)])
      }
      return true
    }
  }

  for (let i = 0; i < canvas.r; i++) {
    for (let j = 0; j < canvas.c; j++) {
      canvas.blocks[canvas.index(i, j)].trans = true;
    }
  }
  return false
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}