export function setup(canvas) {  
  // Make the grid odd or big enough to look good
  canvas.r = (canvas.r == 40)? 39: (canvas.r < 5)? 5: canvas.r + 1 - (canvas.r % 2);
  canvas.c = (canvas.c == 40)? 39: (canvas.c < 5)? 5: canvas.c + 1 - (canvas.c % 2);

  canvas.open = [ [[1, 1], [canvas.r - 2, canvas.c - 2]] ];
  canvas.closed = [];
  canvas.path = [];

  for(let i = 0; i < canvas.r; i++) {
    for(let j = 0; j < canvas.c; j++) {
      canvas.blocks[canvas.index(i, j)].trans = false;
      canvas.blocks[canvas.index(i, j)].wall = false;

      canvas.blocks[canvas.index(0, j)].wall = true;
      canvas.blocks[canvas.index(canvas.r - 1, j)].wall = true;
    }

    canvas.blocks[canvas.index(i, 0)].wall = true;
    canvas.blocks[canvas.index(i, canvas.c - 1)].wall = true;
  }
}

export function algo(canvas) {
  // coord = Coordinates of two points in the rectangle
  // coord = [[i1, j1], [i2, j2]]
  if (canvas.open.length > 0) {
    let coord = canvas.open.pop(),
        cMin = coord[0],
        cMax = coord[1];

    if (cMax[0] - cMin[0] > 1 && cMax[1] - cMin[1] > 1) {

      let isHorizontal = (cMax[0] - cMin[0] < cMax[1] - cMin[1])? true: false;

      // a point, i and j, where there will be a hole in the wall
      let point;

      if (isHorizontal) {
        point = [Math.floor(random(cMin[0], cMax[0]+1) / 2) * 2 + 1, Math.floor(random(cMin[1] + 1, cMax[1]+1) / 2) * 2];
        
        for (let i = cMin[0]; i < cMax[0] + 1; i ++) {
          if (i != point[0] && !canvas.blocks[canvas.index(i, point[1])].start && !canvas.blocks[canvas.index(i, point[1])].end) {
            canvas.blocks[canvas.index(i, point[1])].wall = true;
          }
        }

        canvas.open.push([cMin, [cMax[0], point[1] - 1]]);
        canvas.open.push([[cMin[0], point[1] + 1], cMax]);

      } else {
        point = [Math.floor(random(cMin[0] + 1, cMax[0]+1) / 2) * 2, Math.floor(random(cMin[1], cMax[1]+1) / 2) * 2 + 1];
        
        for (let j = cMin[1]; j < cMax[1] + 1; j ++) {
          if (j != point[1] && !canvas.blocks[canvas.index(point[0], j)].start && !canvas.blocks[canvas.index(point[0], j)].end) {
            canvas.blocks[canvas.index(point[0], j)].wall = true;
          }
        }

        canvas.open.push([cMin, [point[0] - 1 ,cMax[1]]]);
        canvas.open.push([[point[0] + 1 ,cMin[1]], cMax]);

      }
    }
    return true
  } else {

    for(let i = 0; i < canvas.r; i++) {
      for(let j = 0; j < canvas.c; j++) {
        canvas.blocks[canvas.index(i, j)].trans = true;
      }
    }

    return false
  }
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}