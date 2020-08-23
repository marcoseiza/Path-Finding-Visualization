import Canvas from "./canvas.js";
import Block from "./block.js";
import setupOptionButtons from "./options.js";

let blocks = [],
    max_rows = 40, max_cols = 40,
    canvas = new Canvas(document.getElementById("canvas"), 21, 21, 30, max_rows, max_cols);


for (let i = 0; i < max_rows; i++) {
  for (let j = 0; j < max_cols; j++) {
    blocks[max_rows * i + j] = new Block(i, j);
  }
}

canvas.blocks = blocks;

setupOptionButtons(canvas);

