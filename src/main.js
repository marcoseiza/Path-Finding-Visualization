function setup() {
  createCanvas(1100, 1100, WEBGL)
  addScreenPositionFunction();

  // Camera Position Orthi View
  xr = -atan(1/sqrt(2)),
  yr = QUARTER_PI,
  camZ = (height/2) / tan(PI/6),
  camP = createVector(cos(xr)*sin(yr)*camZ, -sin(xr)*camZ, cos(xr)*cos(yr)*camZ)

  // Setup Interactivity
  setupButtons();

  // Put blocks in list
  setGrid()

  start = blocks[1][1]
  start.start = true
  end = blocks[19][19]
  end.end = true

  rows = rows_sld.value()
  columns = columns_sld.value()
  recalcNeighbors()
}

function draw() {
  // Define rows and columns
  if (!playAlgo) {
    rows = rows_sld.value()
    columns = columns_sld.value()
  }

  // Camera Position Ortho View
  let offsetX = rows * size / 2
  let offsetY = columns * size / 2
  ortho((-width / 3) * zoom, (width / 3) * zoom, (height / 3) * zoom, (-height / 3) * zoom, 0, 1300);
  camera((camP.x - offsetX), camP.y, (camP.z - offsetY), -offsetX, 0, -offsetY, 0, 1, 0)

  if (playAlgo) {  

    // order openSet to have smallest fa at the front
    if (openSet.length > 0) {
      let winner_i = 0, closest_i = 0
      for (var i = 0; i < openSet.length; i++) {
        if (openSet[i].fa < openSet[winner_i].fa) {
          winner_i = i
        }
        if (openSet[i].ha < openSet[closest_i].ha) {
          closest_i = i
        }
      }
      //Get the winner to the front
      openSet.unshift(openSet.splice(winner_i, 1)[0])


      //Percent done by how close the closest block is to the end compared to the start
      let startEndDist = distance(start, end)
      let estimate = map(openSet[closest_i].ha / startEndDist, 1, 0, 0, 1)
      if (estimate < previousEstimate) {
        estimate = previousEstimate
      } else {
        previousEstimate = estimate
      }
      previousEstimate = estimate
      progressPercent.innerText = Math.round(((estimate) + Number.EPSILON) * 100) + '%'
      dash = map(estimate, 0, 1, 35, 0)
      progressBar.style.stroke = 'rgb(92, 185, 88)'
      progressBar.style.strokeDashoffset = dash
    }

    if (openFor.length > 0) {
      let winner_i = 0
      for (var i = 0; i < openFor.length; i++) {
        if (openFor[i].fa < openFor[winner_i].fa) {
          winner_i = i
        }
      }
      openFor.unshift(openFor.splice(winner_i, 1)[0])
    }
    if (openBack.length > 0) {
      let winner_i = 0
      for (var i = 0; i < openBack.length; i++) {
        if (openBack[i].fa < openBack[winner_i].fa) {
          winner_i = i
        }
      }
      openBack.unshift(openBack.splice(winner_i, 1)[0])
    }

    if (algoName == 'a_star') {
      playAlgo = aStarStepped()
    } else if (algoName == 'dijkstra') {
      playAlgo = djik()
    } else if (algoName == 'greedy_search') {
      playAlgo = greedySearch()
    } else if (algoName == 'bidirectional_dijkstra') {
      playAlgo = biDijkstra()
    } else if (algoName == 'bidirectional_a_star') {
      playAlgo = biAStar()
    }
  } else {

    if (runRecursiveDivision) {
      runRecursiveDivision = recursiveDivision()
    }
    if (runDFSMaze) {
      runDFSMaze = dfsMaze()
    }
  }

  // Draw Canvas
  for (var i = 0; i < openSet.length; i++) {
    openSet[i].color = color(0, 200, 0)
  }
  for (var i = 0; i < openFor.length; i++) {
    openFor[i].color = color(0, 155, 0)
  }
  for (var i = 0; i < openBack.length; i++) {
    openBack[i].color = color(0, 200, 0)
  }
  for (var i = 0; i < closedSet.length; i++) {
    closedSet[i].color = color(200, 0, 0)
  }
  for (var i = 0; i < closedFor.length; i++) {
    closedFor[i].color = color(155, 0, 0)
  }
  for (var i = 0; i < closedBack.length; i++) {
    closedBack[i].color = color(200, 0, 0)
  }
  for (var i = 0; i < path.length; i++) {
    path[i].color = color(0,0,200)
  }
  background('rgb(221, 221, 221)')
  push()
  for(let z=0; z<columns; z+= 1) {
    for(let x=0; x<rows; x+= 1) {
      if (mouseIsPressed) {

        // If the first click is on the start or end block set moveEnd or moveStart to true
        if (blocks[z][x].start || blocks[z][x].end) {
          isStartEnd = blocks[z][x].collision(mouseX - width/2, mouseY - height/2)
          if (isStartEnd == 'start') {
            moveStart = true
            playAlgo = false
          } else if (isStartEnd == 'end') {
            moveEnd = true
            playAlgo = false
          }
        }

        // If the first click wasn't the start or the end, then make walls
        if (!moveStart && !moveEnd) {
          if (blocks[z][x].collision(mouseX - width/2, mouseY - height/2)) {
            blocks[z][x].clicked = true
          } else {
            if (blocks[z][x].clicked) {
              if (!blocks[z][x].end && !blocks[z][x].start) {
                blocks[z][x].wall = !blocks[z][x].wall
                blocks[z][x].clicked = false;
              }
            }
          }

        // Else if the first click was start or end, get the logic to move the block
        } else {
          blocks[z][x].setColor()
          openSet = []
          openFor = []
          openBack = []
          closedFor = []
          closedBack = []
          closedSet = []
          path = []
          progressBar.style.strokeDashoffset = 35
          progressPercent.innerHTML = ''
          
          if (moveStart) {
            if (blocks[z][x].collision(mouseX - width/2, mouseY - height/2)) {
              if (!blocks[z][x].start && !blocks[z][x].end) {
                start.start = false
                start = blocks[z][x]
                blocks[z][x].start = true
                blocks[z][x].wall = false
              }
            }
          }
          if (moveEnd) {
            if (blocks[z][x].collision(mouseX - width/2, mouseY - height/2)) {
              if (!blocks[z][x].start && !blocks[z][x].end) {
                end.end = false
                end = blocks[z][x]
                blocks[z][x].end = true
                blocks[z][x].wall = false
              }
            }
          }
        }
      } else {
        if ((blocks[z][x].start || blocks[z][x].end) && blocks[z][x].wall_offsetHeight > 0) {
          blocks[z][x].wall_offsetHeight -= 0.3 / 7
        }
      }
      blocks[z][x].draw()
    }
  }
  pop()
}

// functions

function mouseReleased() {
  moveStart = moveEnd = false
  for(let z=0; z<columns; z+= 1) {
    for(let x=0; x<rows; x+= 1) {
      if (blocks[z][x].clicked) {
        if (!blocks[z][x].start && !blocks[z][x].end) {
          blocks[z][x].wall = !blocks[z][x].wall
          blocks[z][x].clicked = false
        }
      }
    }
  }
}

function mouseWheel(event) {
  if (!playPause_btn.checked()){
    zoom_offset = event.delta
    let max = 100
    zoom_offset = (zoom_offset > max)? max: event.delta;
    zoom_offset = (zoom_offset < -max)? -max: event.delta;
    zoom += map(zoom_offset, -max, max, -0.8, 0.8)
    zoom = (zoom <= 0.8)? 0.8: zoom;
  }
}

function distance(neighbor, end) {
  return abs(end.i - neighbor.i) + abs(end.j - neighbor.j)
}

function setupButtons() {
  progressPercent = document.getElementById('progressPercent')
  progressBar = document.getElementById('status_circle_percent')
  rows_sld = select('#rows')
  columns_sld = select('#columns')
  playPause_btn = select('#playPause')
  reset_btn = select('#reset')
  start_btn = select('#start')
  random_sld = select('#random')
  clear_btn = select('#clear')
  algorithms_rdos = document.getElementsByName('algorithms')
  maze_options = document.getElementsByClassName('optionsMenu__mazes')

  reset_btn.mouseClicked(resetBoard)
  clear_btn.mouseClicked(clearBoard)
  playPause_btn.changed(playPauseBoard)
  start_btn.mouseClicked(startAlgo)
  random_sld.input(randomWalls)
  sliderCounterElt(random_sld)
  rows_sld.input(sliderCounter)
  rows_sld.mouseReleased(recalcNeighbors)
  sliderCounterElt(rows_sld)
  columns_sld.input(sliderCounter)
  columns_sld.mouseReleased(recalcNeighbors)
  sliderCounterElt(columns_sld)

  for (let i=0; i < algorithms_rdos.length; i++) {
    algorithms_rdos[i].oninput = function() {changeAlgorithm(algorithms_rdos[i])}
  }
  for (let i=0; i < maze_options.length; i++) {
    maze_options[i].onclick = function() {runMaze(this)}
  }
}

function runMaze(el) {
  mazeSetup();
  if (el.id == 'recursive_division') {
    runRecursiveDivision = true;
    mazeStack.push([[1, 1], [columns - 2, rows - 2]]);
  } else if (el.id == 'dps_maze') {
    closedSet = [];
    runDFSMaze = true;
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        blocks[i][j].wall = true;
        blocks[i][j].wall_offsetHeight = 0;
        blocks[i][j].visited = false;
        if (i == 0 || j == 0 || i == columns - 1 || j == rows - 1) blocks[i][j].visited = true;
        if (i % 2 == 0 && j % 2 == 0) blocks[i][j].visited = true;  
      }
    }
    start.wall = false;
    end.wall = false;
    mazeStack.push(blocks[Math.floor(random(1, columns-1) / 2) * 2 + 1][Math.floor(random(1, rows-1) / 2) * 2 + 1])
  }
}

function recalcNeighbors() {
  for(let z=0; z<columns; z++) {
    for(let x=0; x<rows; x++) {
      blocks[z][x].neighbors = []
      blocks[z][x].addNeighbors(blocks, rows, columns)
    }
  }
}

function changeAlgorithm(el) {
  let titlePreview = document.getElementById('algo_title');
  if (!playAlgo) {
    titlePreview.innerHTML = el.parentNode.innerText
    algoName = el.value
  } else if (algoName != el.value) {
    el.checked = false
    titlePreview.style.backgroundColor = 'rgb(255, 71, 71)'
    window.setTimeout(function() {
      titlePreview.style.backgroundColor = ''
    }, 200)
  }
}

function sliderCounterElt(el) {
  el.elt.nextElementSibling.querySelector('span').innerHTML = el.value()
  const newVal = Number(((el.elt.value - el.elt.min) * 100) / (el.elt.max - el.elt.min));
  el.elt.nextElementSibling.style.left = `calc(${newVal}% + (${-2 - newVal * 0.13}px))`;
}

function moveStartEnd() {
  // This handles the case where the end or start blocks end up outside of the grid because of the grid resizing
  if (end.i > columns - 1) {
    end.end = false
    if (blocks[columns - 1][end.j].wall) blocks[columns - 1][end.j].wall = false;
    if (blocks[columns - 1][end.j].start) {
      blocks[columns - 1][end.j].start = false
      blocks[columns - 2][end.j].start = true
      start = blocks[columns - 2][end.j]
    }
    blocks[columns - 1][end.j].end = true
    end = blocks[columns - 1][end.j]
  } else if (end.j > rows - 1) {
    end.end = false
    if (blocks[end.i][rows - 1].wall) blocks[end.i][rows - 1].wall = false;
    if (blocks[end.i][rows - 1].start) {
      blocks[end.i][rows - 1].start = false
      blocks[end.i][rows - 2].start = true
      start = blocks[end.i][rows - 2]
    }
    blocks[end.i][rows - 1].end = true
    end = blocks[end.i][rows - 1]
  }
  if (start.i > columns - 1) {
    start.start = false
    if (blocks[columns - 1][start.j].wall) blocks[columns - 1][start.j].wall = false;
    if (blocks[columns - 1][start.j].end) {
      blocks[columns - 1][start.j].end = false
      blocks[columns - 2][start.j].end = true
      end = blocks[columns - 2][start.j]
    }
    blocks[columns - 1][start.j].start = true
    start = blocks[columns - 1][start.j]
  } else if (start.j > rows - 1) {
    start.start = false
    if (blocks[start.i][rows - 1].wall) blocks[start.i][rows - 1].wall = false;
    if (blocks[start.i][rows - 1].end) {
      blocks[start.i][rows - 1].end = false
      blocks[start.i][rows - 2].end = true
      end = blocks[start.i][rows - 2]
    }
    blocks[start.i][rows - 1].start = true
    start = blocks[start.i][rows - 1]
  }
}

function sliderCounter() {
  if (!playAlgo) {
    rows = rows_sld.value()
    columns = columns_sld.value()
  }
  moveStartEnd()
  this.elt.nextElementSibling.querySelector('span').innerHTML = this.value()
  const newVal = Number(((this.elt.value - this.elt.min) * 100) / (this.elt.max - this.elt.min));
  this.elt.nextElementSibling.style.left = `calc(${newVal}% + (${-2 - newVal * 0.13}px))`;
}

function playPauseBoard() {
  if (playPause_btn.checked()) {
    noLoop()
  } else {
    loop()
  }
}

function clearBoard() {
  for(let z=0; z<blocks.length; z++) {
    for(let x=0; x<blocks[z].length; x++) {
      blocks[z][x].setColor()
      blocks[z][x].wall = false
      openSet = []
      openFor = []
      openBack = []
      closedSet = []
      closedFor = []
      closedBack = []
      path = []
    }
  }
}

function randomWalls() {
  sliderCounterElt(this)
  if (!playAlgo) {
    for(let z=0; z<columns; z++) {
      for(let x=0; x<rows; x++) {
        blocks[z][x].wall = random(0, 1) >= (1-random_sld.value());
        blocks[z][x].wall_offsetHeight = 0
      }
    }
    start.wall = end.wall = false
  }
}

function setupAlgo(algoName) {
  for(let z=0; z<blocks.length; z++) {
    for(let x=0; x<blocks[z].length; x++) {
      blocks[z][x].ga = blocks[z][x].fa = 0
      blocks[z][x].ha = distance(blocks[z][x], end)
      blocks[z][x].visited = false;
      if (!blocks[z][x].wall) {
        blocks[z][x].setColor()
      }
      blocks[z][x].previous = undefined
    }
  }
  openSet = [];
  openFor = [];
  openBack = [];
  closedFor = [];
  closedBack = [];
  openSetPrime = [];
  closedSet = [];
  path = [];
  p = Infinity;
  previousEstimate = 0;
  if (algoName == 'bidirectional_dijkstra' || algoName == 'bidirectional_a_star') {
    openFor.push(start);
    openBack.push(end);
  }
  openSet.push(start)
}

function startAlgo() {
  if (!playAlgo) {
    if (algoName != undefined) {
      setupAlgo(algoName)
      playAlgo = true
      playPause_btn.elt.checked = false
      playPauseBoard()
    } else {
      this.elt.style.backgroundColor = 'rgb(211, 39, 39)'
      button = this.elt
      window.setTimeout(function() {
        button.style.backgroundColor = ''
      }, 200)
    }
  }
}

function resetBoard() {
  playAlgo = false
  rows_sld.value(40)
  columns_sld.value(40)
  rows = rows_sld.value()
  columns = columns_sld.value()
  setGrid();
  random_sld.value(0)
  rows_sld.value(21)
  columns_sld.value(21)
  sliderCounterElt(random_sld)
  sliderCounterElt(rows_sld)
  sliderCounterElt(columns_sld)
  rows = rows_sld.value()
  columns = columns_sld.value()
  openSet = []
  openFor = []
  openBack = []
  closedSet = []
  closedFor = []
  closedBack = []
  path = []
  start = blocks[1][1]
  start.start = true
  end = blocks[columns-2][rows-2]
  end.end = true
  playPause_btn.elt.checked = false
  playPauseBoard()
}

function setGrid() {
  blocks = []
  for(let z=0; z<columns; z+= 1) {
    row = []
    for(let x=0; x<rows; x+= 1) {
      row[x] = new Block(size, size, size, z, x, gap)
    }
    blocks[z] = row
  }
  rows = rows_sld.value()
  columns = columns_sld.value()
  for(let z=0; z<columns; z++) {
    for(let x=0; x<rows; x++) {
      blocks[z][x].addNeighbors(blocks, rows, columns)
    }
  }
}