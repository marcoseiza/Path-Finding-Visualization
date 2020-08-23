import * as Dijk from './algorithms/dijkstra.js';
import * as A_Star from './algorithms/a_star.js';
import * as Greedy from './algorithms/greedySearch.js';
import * as BFS from './algorithms/bfs.js';
import * as DFS from './algorithms/dfs.js';
import * as Recur_Div from './mazes/recursive_division.js';
import * as Dfs_Maze from './mazes/dfs_maze.js';
import * as Stair from './mazes/stair_pattern.js';
import * as Krusal from './mazes/kruskal.js';
import * as Prim from './mazes/prim.js';


export default function setupOptionButtons(canvas) {
  let algo_title = document.getElementById("algo_title"), 
      row_slider = document.getElementById("row_slider"),
      column_slider = document.getElementById("column_slider"),
      size_slider = document.getElementById("size_slider");


  document.getElementById("startButton").onclick = function() {
    if (document.getElementById("playPause").checked)
      document.getElementById("playPause").checked = false;
    canvas.startAlgo();
  }

  document.getElementById("playPause").oninput = function(e) {
    if (e.target.checked) {
      clearInterval(canvas.algoTimer)
    } else {
      if (canvas.runningAlgo)
        canvas.startAlgo();
    }
  }

  document.getElementById("reset").onclick = function() {
    canvas.r = 21;
    canvas.c = 21;
    canvas.open = [];
    canvas.path = [];
    canvas.closed = [];
    canvas.startBlock.start = false;
    canvas.blocks[canvas.index(19, 19)].start = true;
    canvas.startBlock = canvas.blocks[canvas.index(19, 19)];
    canvas.endBlock.end = false;
    canvas.blocks[canvas.index(1, 1)].end = true;
    canvas.endBlock= canvas.blocks[canvas.index(1, 1)];
    for (let i = 0; i < canvas.r; i++) {
      for (let j = 0; j < canvas.c; j++) {
        canvas.blocks[canvas.index(i, j)].trans = false;
        canvas.blocks[canvas.index(i, j)].wall = false;
      }
    }
    setTimeout(function() {
      for (let i = 0; i < canvas.r; i++) {
        for (let j = 0; j < canvas.c; j++) {
          canvas.blocks[canvas.index(i, j)].trans = true;
        }
      }
    }, 500)
  }

  document.getElementById("clear").onclick = function() {
    canvas.open = [];
    canvas.path = [];
    canvas.closed = [];
    for (let i = 0; i < canvas.r; i++) {
      for (let j = 0; j < canvas.c; j++) {
        canvas.blocks[canvas.index(i, j)].trans = false;
        canvas.blocks[canvas.index(i, j)].wall = false;
      }
    }
    setTimeout(function() {
      for (let i = 0; i < canvas.r; i++) {
        for (let j = 0; j < canvas.c; j++) {
          canvas.blocks[canvas.index(i, j)].trans = true;
        }
      }
    }, 500)
  }

  window.addEventListener('click', function(e) {
    if (e.target != document.getElementById('algorithms')
        && !document.querySelector('.optionsMenu__algorithms').contains(e.target)
        && e.target != document.getElementById('algo_title')) {

      document.getElementById('algorithms').checked = false;
    }
    if (!document.getElementById('mazes').contains(e.target)) {
      document.getElementById('mazes').checked = false;
    }
  })

  document.getElementById("a_star").onclick = function() {
    canvas.updateAlgo = false;
    canvas.algo = A_Star.algo; canvas.algoSetup = A_Star.setup;
    algo_title.innerText = this.innerText;
  }

  document.getElementById("dijkstra").onclick = function() {
    canvas.updateAlgo = false;
    canvas.algo = Dijk.algo; canvas.algoSetup = Dijk.setup;
    algo_title.innerText = this.innerText;
  }

  document.getElementById("greedy_search").onclick = function() {
    canvas.updateAlgo = false;
    canvas.algo = Greedy.algo; canvas.algoSetup = Greedy.setup;
    algo_title.innerText = this.innerText;
  }

  document.getElementById("bfs").onclick = function() {
    canvas.updateAlgo = false;
    canvas.algo = BFS.algo; canvas.algoSetup = BFS.setup;
    algo_title.innerText = this.innerText;
  }

  document.getElementById("dfs").onclick = function() {
    canvas.updateAlgo = false;
    canvas.algo = DFS.algo; canvas.algoSetup = DFS.setup;
    algo_title.innerText = this.innerText;
  }

  document.getElementById("recursive_division").onclick = function() {
    let prevAlgo = canvas.algo,
        prevAlgoSetup = canvas.algoSetup;

    canvas.updateAlgo = false;
    canvas.algo = Recur_Div.algo; canvas.algoSetup = Recur_Div.setup;
    canvas.startAlgo();

    canvas.algo = prevAlgo; canvas.algoSetup = prevAlgoSetup;
    row_slider.value = canvas.r;
    column_slider.value = canvas.c;
    sliderCounter(row_slider);
    sliderCounter(column_slider);
  }

  document.getElementById("dps_maze").onclick = function() {
    let prevAlgo = canvas.algo,
        prevAlgoSetup = canvas.algoSetup;

    canvas.updateAlgo = false;
    canvas.algo = Dfs_Maze.algo; canvas.algoSetup = Dfs_Maze.setup;
    canvas.startAlgo();

    canvas.algo = prevAlgo; canvas.algoSetup = prevAlgoSetup;
    row_slider.value = canvas.r;
    column_slider.value = canvas.c;
    sliderCounter(row_slider);
    sliderCounter(column_slider);
  }

  let random_walls_els = document.getElementsByClassName("random");
  for (let i = 0; i < random_walls_els.length; i++) {
    random_walls_els[i].onclick = function(e) {
      canvas.randomWalls(e.target.value);

      setTimeout(function() {
        for (let i = 0; i < canvas.r; i++) {
          for (let j = 0; j < canvas.c; j++) {
            canvas.blocks[canvas.index(i, j)].trans = true;
          }
        }
      }, 500)
    }
  }

  document.getElementById("stair").onclick = function() {
    let prevAlgo = canvas.algo, prevAlgoSetup = canvas.algoSetup;

    canvas.updateAlgo = false;
    canvas.algo = Stair.algo; canvas.algoSetup = Stair.setup;
    canvas.startAlgo();

    canvas.algo = prevAlgo; canvas.algoSetup = prevAlgoSetup;
  }

  document.getElementById("krusal").onclick = function() {
    let prevAlgo = canvas.algo, prevAlgoSetup = canvas.algoSetup;

    canvas.updateAlgo = false;
    canvas.algo = Krusal.algo; canvas.algoSetup = Krusal.setup;
    canvas.startAlgo();

    canvas.algo = prevAlgo; canvas.algoSetup = prevAlgoSetup;

    row_slider.value = canvas.r;
    column_slider.value = canvas.c;
    sliderCounter(row_slider);
    sliderCounter(column_slider);
  }

  document.getElementById("prim").onclick = function() {
    let prevAlgo = canvas.algo, prevAlgoSetup = canvas.algoSetup;

    canvas.updateAlgo = false;
    canvas.algo = Prim.algo; canvas.algoSetup = Prim.setup;
    canvas.startAlgo();

    canvas.algo = prevAlgo; canvas.algoSetup = prevAlgoSetup;

    row_slider.value = canvas.r;
    column_slider.value = canvas.c;
    sliderCounter(row_slider);
    sliderCounter(column_slider);
  }

  sliderCounter(row_slider);
  row_slider.oninput = (e) => {
    sliderCounter(e.target);
    canvas.r = parseInt(e.target.value);
  }
  row_slider.onmouseup = (e) => {
    canvas.r = parseInt(e.target.value);
  }

  sliderCounter(column_slider);
  column_slider.oninput = (e) => {
    sliderCounter(e.target);
    canvas.c = parseInt(e.target.value);
  }
  column_slider.onmouseup = (e) => {
    canvas.c = parseInt(e.target.value);
  }

  sliderCounter(size_slider);
  size_slider.oninput = (e) => {
    sliderCounter(e.target);
    canvas.s = parseInt(e.target.value);
  }
  size_slider.onmouseup = (e) => {
    canvas.s = parseInt(e.target.value);
  }

  document.getElementsByName("speed").forEach(el => {
    el.onchange = function(e) {
      canvas.algoDelta = parseInt(el.value);
      if (canvas.runningAlgo) {
        clearInterval(canvas.algoTimer);
        canvas.startAlgo();
      }
    }
  })

  document.getElementsByName("canvas_dimensions").forEach(el => {
    el.onchange = function() {
      console.log(
        canvas.el.getBoundingClientRect().left,
        canvas.el.getBoundingClientRect().top
      )
      canvas.el.classList.remove("twoD")
      if (el.value != "")
        canvas.el.classList.add(el.value);
    }
  })

  document.getElementsByName("neighbors").forEach(el => {
    el.onchange = function(e) {
      canvas.diagonal = (el.value == "true");
    }
  })
}

function sliderCounter(el) {
  el.nextElementSibling.querySelector('span').innerHTML = el.value;
}

