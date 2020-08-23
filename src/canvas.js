export default class Canvas {
  constructor(canvas, rows, cols, size, max_r, max_c) {
    this.el = canvas;
    this._blocks = [];
    this._r = rows;
    this._c = cols;
    this.max_r = max_r;
    this.max_c = max_c;
    this._s = size;
    this.el.style.setProperty("--size", this.s + "px");

    // em == edit_mode
    this.em = undefined;
    this.scale = 1;

    this._open = [];
    this._open.className = "open";
    this._closed = [];
    this._closed.className = "closed";
    this._path = [];
    this._path.className = "path";
    this.startBlock = undefined;
    this.endBlock = undefined;
    this._diagonal = false;

    this.algoSetup = undefined;
    this.algo = undefined;
    this._runningAlgo = null;
    this._successfulAlgo = true;
    this.updateAlgo = false;
    this.algoTimer = null;
    this.algoDelta = 15;
  }

  get r() {return this._r}

  set r(value) {
    this.readjustSize(value, this.c)
    
  }


  get c() {return this._c}

  set c(value) {
    this.readjustSize(this.r, value)
  }


  get s() {return this._s}

  set s(value) {
    this._s = value;
    this.el.style.setProperty("--size", value + "px");
  }


  get open() {return this._open}

  set open(array) {
    for (let i = 0; i < this._open.length; i++) {
      this._open[i].el.classList.remove("open");
    }
    this._open = array;
    this._open.className = "open";
    for (let i = 0; i < this._open.length; i++) {
      if (this._open[i].el) {
        this._open[i].el.classList.add("open");
      }
    }
  }


  get closed() {return this._closed}

  set closed(array) {
    for (let i = 0; i < this._closed.length; i++) {
      this._closed[i].el.classList.remove("closed");
    }
    this._closed = array;
    this._closed.className = "closed";
    for (let i = 0; i < this._closed.length; i++) {
      if (this._closed[i].el) {
        this._closed[i].el.classList.add("closed");
      } 
    }
  }


  get path() {return this._path}

  set path(array) {
    for (let i = 0; i < this._path.length; i++) {
      this._path[i].el.classList.remove("path");
    }
    this._path = array;
    this._path.className = "path";
    for (let i = 0; i < this._path.length; i++) {
      if (this._path[i].el) {
        this._path[i].el.classList.add("path");
      }
    }
  }


  get blocks() {return this._blocks;}

  set blocks(blocks) {
    this.el.style.setProperty("--rows", this.r);
    this.el.style.setProperty("--cols", this.c);

    this._blocks = blocks;

    for (let i = 0; i < this.max_r; i++) {
      for (let j = 0; j < this.max_c; j++) {
        
        let block = this._blocks[this.index(i, j)];

        if (i >= this.r || j >= this.c) {
          this.blocks[this.index(i, j)].el.classList.add("hide")
        } else {
          if (j == this.c - 1) {
            block.el.classList.add("endr");
          }
          if (i == this.r - 1) {
            block.el.classList.add("endc");
          }
          
          if (i == 1 && j == 1) {
            block.end = true;
            this.endBlock = block;
          }
  
          if (i == this.r - 2 && j == this.c - 2) {
            block.start = true;
            this.startBlock = block;
          }
        }

        this.setNeighbors(block);

        this.buildBlockEventListeners(block);

        this.el.appendChild(block.el);
      }
    }

    this.buildDragDrop();
  }

  
  get successfulAlgo() {return this._successfulAlgo}

  set successfulAlgo(bool) {
    this._successfulAlgo = bool;

    if (!bool) {
      document.getElementById("startButton").classList.add("error");
      setTimeout(function() {
        document.getElementById("startButton").classList.remove("error");
      }, 2000)
    }
  }


  get runningAlgo() {return this._runningAlgo}

  set runningAlgo(bool) {
    this._runningAlgo = bool;
    document.getElementById("startButton").disabled = bool;
    document.getElementById("orthogonal_neighbor").disabled = bool;
    document.getElementById("diagonal_neighbor").disabled = bool;
    document.getElementById("algorithms").disabled = bool;
    document.getElementById("mazes").disabled = bool;
    if (bool)
      this.el.classList.add("no_hover");
    else 
      this.el.classList.remove("no_hover");
  }

  get diagonal() {return this._diagonal}

  set diagonal(bool) {
    this._diagonal = bool;
    for (let i = 0; i < this.r; i++) {
      for (let j = 0; j < this.c; j++) {
        this.setNeighbors(this.blocks[this.index(i, j)])
      }
    }
  }

  index(i, j) {
    return this.max_r * i + j;
  }

  setNeighbors(block) {
    block.neighbors = [];
    if (block.x > 0 && block.x < this.r) {block.neighbors.push(this.blocks[this.index(block.x-1, block.y)])}
    if (block.y > 0 && block.y < this.c) {block.neighbors.push(this.blocks[this.index(block.x, block.y-1)])}
    if (block.x < this.r - 1) {block.neighbors.push(this.blocks[this.index(block.x+1, block.y)])}
    if (block.y < this.c - 1) {block.neighbors.push(this.blocks[this.index(block.x, block.y+1)])}

    if (this.diagonal) {
      if (block.x > 0 && block.y > 0) {block.neighbors.push(this.blocks[this.index(block.x-1, block.y-1)]);}
      if (block.x < this.r - 1 && block.y > 0) {block.neighbors.push(this.blocks[this.index(block.x+1, block.y-1)]);}
      if (block.x < this.r - 1 && block.y < this.c - 1) {block.neighbors.push(this.blocks[this.index(block.x+1, block.y+1)]);}
      if (block.x > 0 && block.y < this.c - 1) {block.neighbors.push(this.blocks[this.index(block.x-1, block.y+1)]);}
    }
  }

  calcHa(a, b) {
    if (this.diagonal) {
      return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
    } else {
      return Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
    }
  }

  buildZoom() {
    let time = Date.now(),
        wait = 15;

    window.onwheel = (e) => {
      e.stopPropagation()

      if ((time + wait - Date.now()) < 0) {
        this.scale += e.deltaY * 0.005;
        this.scale = Math.min(Math.max(.5, this.scale), 1.7);
        this.el.style.setProperty("--scale", this.scale);
      } 

      time = Date.now();
    }
  }

  buildDragDrop() {
    let wrap = this.el.parentElement,
        main = wrap.parentElement;

    main.onmousedown = (e) => {
      if (!e.path.includes(this.el))  {
        main.style.cursor = "grabbing";

        let dx = e.clientX - wrap.getBoundingClientRect().left;
        let dy = e.clientY - wrap.getBoundingClientRect().top;
      
        wrap.style.position = 'absolute';
      
        moveAt(e.pageX, e.pageY);
      
        function moveAt(px, py) {
          wrap.style.left = px - dx + 'px';
          wrap.style.top = py - dy + 'px';
        }
      
        main.onmousemove = (e) => {
          moveAt(e.pageX, e.pageY);
        }
        
        main.onmouseleave = function() {
          main.onmousemove = null;
        }
        main.onmouseup = function() {
          main.onmousemove = null;
          main.style.cursor = "grab";
        };
      }
    };
  }

  buildBlockEventListeners(block) {
    block.el.onmousedown = () => {
      if (block.start) {
        if (!this.runningAlgo)
          this.em = 3;
      } else if (block.end) {
        if (!this.runningAlgo)
          this.em = 2;
      } else if (block.wall) {
        if (!this.runningAlgo) {
          this.em = 1;
          block.wall = false;
        }
      } else {
        if (!this.runningAlgo) {
          this.em = 0;
          block.wall = true;
        }
      }
    }
    
    window.onmouseup = () => {
      this.em = undefined;
    }
    window.onmouseleave = () => {
      this.em = undefined;
    }

    block.el.onmouseover = (e) => {
      if (this.em == 3 && !block.end) {
        this.startBlock.start = false;
        this.startBlock = block;
        block.start = true;
        if (!this.runningAlgo) {
          if (this.updateAlgo) {
            this.algoDelta = 0;
            this.startAlgo();
          } else {
            this.open = [];
            this.closed = [];
            this.path = [];
          }
        }
      } else if (this.em == 2 && !block.start) {
        this.endBlock.end = false;
        this.endBlock = block;
        block.end = true;
        if (!this.runningAlgo) {
          if (this.updateAlgo) {
            this.algoDelta = 0;
            this.startAlgo();
          } else {
            this.open = [];
            this.closed = [];
            this.path = [];
          }
        }
      } else if (this.em == 1) {
        block.wall = false;
      } else if (this.em == 0) {
        block.wall = true;
      }
    }
  }

  sortBlocks() {
    let win_i = 0;

    for (let i = 0; i < this.open.length; i++) {
      if (this.open[i].fa < this.open[win_i].fa) {
        win_i = i;
      }
    }

    this.open.unshift(this.open.splice(win_i, 1)[0]);
  }

  startAlgo() {
    if (this.algo && this.algoSetup) {
      if (this.runningAlgo) {
        if (this.algoDelta > 0) {
          let current_algo = this.algo;
          setTimeout(() => {
            this.algoTimer = setInterval(() => {
              this.runningAlgo = current_algo(this);
              if (!this.runningAlgo) {
                clearInterval(this.algoTimer);
              }
            }, this.algoDelta);
          }, 50)
        } else {
          while (this.runningAlgo) {
            this.runningAlgo = this.algo(this);
          }
          this.algoDelta = 15;
        }
      } else {
        this.algoSetup(this);
        this.runningAlgo = true;
        this.startAlgo(this.algoSetup, this.algo);
      }
     }
  }

  readjustSize(rows, cols) {

    if (this.startBlock.x > rows - 2) {
      this.startBlock.start = false;
      this.startBlock = this.blocks[this.index(Math.min(this.startBlock.x - 1, this.r - 1), this.startBlock.y)];
    } else if (this.startBlock.y > cols - 2) {
      this.startBlock.start = false;
      this.startBlock = this.blocks[this.index(this.startBlock.x, Math.min(this.startBlock.y - 1, this.c - 1))];
    }
    
    if (this.endBlock.x > rows - 2) {
      this.endBlock.end = false;
      this.endBlock = this.blocks[this.index(Math.min(this.endBlock.x - 1, this.r - 1), this.endBlock.y)];
    } else if (this.endBlock.y > cols - 2) {
      this.endBlock.end = false;
      this.endBlock = this.blocks[this.index(this.endBlock.x, Math.min(this.endBlock.y - 1, this.c - 1))];
    }

    if (this.startBlock.end) {
      this.endBlock.end = false;
      this.endBlock = this.blocks[this.index(this.endBlock.x - 1, this.endBlock.y)]
    }
    if (this.endBlock.start) {
      this.startBlock.start = false;
      this.startBlock = this.blocks[this.index(this.startBlock.x - 1, this.startBlock.y)]
    }

    this.startBlock.start = true;
    this.endBlock.end = true;
    

    let minRow = (rows == this.r)? 1 : Math.min(this.r, rows),
        maxRow = Math.max(this.r, rows),
        minCol = (cols == this.c)? 1 : Math.min(this.c, cols),
        maxCol = Math.max(this.c, cols);

    for (let i = minRow - 1; i < maxRow; i++) {
      for (let j = minCol - 1; j < maxCol; j++) {
        if (!this.blocks[this.index(i, j)]) {
          console.log(this.blocks, this.blocks[this.index(i, j)], this.index(i, j))
        }
        this.blocks[this.index(i, j)].el.classList.remove("hide")
        this.blocks[this.index(i, j)].el.classList.remove("endr");
        this.blocks[this.index(i, j)].el.classList.remove("endc");

        if (j >= cols || i >= rows) {
          this.blocks[this.index(i, j)].el.classList.add("hide");
        } else {
          this.setNeighbors(this.blocks[this.index(i, j)])
        }

        if (j == cols - 1 && i < rows) {
          this.blocks[this.index(i, j)].el.classList.add("endr");
        }
        if (i == rows - 1 && j < cols) {
          this.blocks[this.index(i, j)].el.classList.add("endc");
        }
      }
    }

    
    this._r = rows;
    this._c = cols;
    
    this.el.style.setProperty("--rows", this.r);
    this.el.style.setProperty("--cols", this.c);
    
  }

  randomWalls(prob) {
    this.open = [];
    this.path = [];
    this.closed = [];

    for (let i = 0; i < this.r; i++) {
      for (let j = 0; j < this.c; j++) {
        this.blocks[this.index(i, j)].trans = false;
        this.blocks[this.index(i, j)].wallNoTrans((Math.random() < prob)? true: false);
      }
    }
  }
}


// Special array prototype methods for adding and deleting blocks from the open, closed and path arrays

Array.prototype.pushBlock = function(block) {
  this.push(block);
  block.el.classList.add(this.className);
}
Array.prototype.popBlock = function() {
  let block = this.pop();
  if (block) {
    block.el.classList.remove(this.className);
  }
  return block;
}
Array.prototype.unshiftBlock = function(block) {
  this.unshift(block);
  block.el.classList.add(this.className);
}
Array.prototype.shiftBlock = function() {
  let block = this.shift();
  if (block) {
    block.el.classList.remove(this.className);
  }
  return block;
}