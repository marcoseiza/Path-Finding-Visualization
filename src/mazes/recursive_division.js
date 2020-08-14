let mazeStack = []
// width, height, offset

function mazeSetup() {
  // Make the grid odd or big enough to look good
  rows = (rows == 40)? 39: (rows < 5)? 5: (rows % 2 == 0)? rows + 1: rows;
  columns = (columns == 40)? 39: (columns < 5)? 5: (columns % 2 == 0)? columns + 1: columns;
  rows_sld.value(rows);
  sliderCounterElt(rows_sld);
  columns_sld.value(columns);
  sliderCounterElt(columns_sld);
  recalcNeighbors();
  openSet = [];
  closedSet = [];
  path = [];

  for(let i = 0; i < columns; i++) {
    for(let j = 0; j < rows; j++) {
      blocks[i][j].setColor();
      blocks[i][j].wall = false;
      blocks[0][j].wall = true;
      blocks[0][j].wall_offsetHeight = 0;
      blocks[columns-1][j].wall = true;
      blocks[columns-1][j].wall_offsetHeight = 0;
    }
    blocks[i][0].wall = true;
    blocks[i][0].wall_offsetHeight = 0;
    blocks[i][rows-1].wall = true;
    blocks[i][rows-1].wall_offsetHeight = 0;
  }
  start.wall = false;
  end.wall = false;
}

function recursiveDivision() {
  // coord = Coordinates of the two points in the rectangle
  if (mazeStack.length != 0) {
    var coord = mazeStack.pop(),
        cMin = coord[0],
        cMax = coord[1];

    if (cMax[0] - cMin[0] > 1 && cMax[1] - cMin[1] > 1) {

      var isHorizontal = (cMax[0] - cMin[0] < cMax[1] - cMin[1])? true: false;
      // point, i and j, where there will be a hole
      var point;

      if (isHorizontal) {
        point = [Math.floor(random(cMin[0], cMax[0]+1) / 2) * 2 + 1, Math.floor(random(cMin[1] + 1, cMax[1]+1) / 2) * 2];
        for (let i = cMin[0]; i < cMax[0] + 1; i ++) {
          if (i != point[0] && !blocks[i][point[1]].start && !blocks[i][point[1]].end) {
            blocks[i][point[1]].wall = true;
            blocks[i][point[1]].wall_offsetHeight = 0;
          }
        }
        mazeStack.push([cMin, [cMax[0], point[1] - 1]]);
        mazeStack.push([[cMin[0], point[1] + 1], cMax]);
      } else {
        point = [Math.floor(random(cMin[0] + 1, cMax[0]+1) / 2) * 2, Math.floor(random(cMin[1], cMax[1]+1) / 2) * 2 + 1];
        for (let j = cMin[1]; j < cMax[1] + 1; j ++) {
          if (j != point[1] && !blocks[point[0]][j].start && !blocks[point[0]][j].end) {
            blocks[point[0]][j].wall = true;
            blocks[point[0]][j].wall_offsetHeight = 0;
          }
        }
        mazeStack.push([cMin, [point[0] - 1 ,cMax[1]]]);
        mazeStack.push([[point[0] + 1 ,cMin[1]], cMax]);
      }
    }
    return true
  } else {
    return false
  }
}