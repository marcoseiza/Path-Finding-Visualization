class Block {
  constructor(w, h, d, i, j, gap) {
    this.start = false;
    this.end = false;
    this.w = w;
    this.h = h;
    this.d = d;
    this.i = i;
    this.j = j;
    this.x = -(j * (this.w + gap));
    this.y = 0;
    this.z = -(i * (this.d + gap));
    this.color = color(197, 181, 148);
    this.wall = false;
    this.wall_offsetHeight = 0;
    this.ga = 0;
    this.ha = 0;
    this.fa = 0;
    this.visited = false;
    this.clicked = false;
    this.neighbors = [];
    this.previous = undefined;
    // 2D positioning
  }

  setColor(col = color(197, 181, 148)) {
    this.color = col;
  }

  draw() {
    push();
    strokeWeight(0.5);
    let shadow = color(0);
    let light = color(255);

    if (this.wall) {
      let wall_color = color(99, 91, 73);

      // grow wall
      if (this.wall_offsetHeight < 0.3) { this.wall_offsetHeight += 0.3/10}

      // walls of wall block, optimizing rendering

      var drawWallLeft  = (this.i == 0)? true: !(this.neighbors[0].wall && Math.round(((this.neighbors[0].wall_offsetHeight) + Number.EPSILON) * 100) / 100 == 0.3);
      var drawWallRight = (this.j == 0)? true: (this.i == 0)? !(this.neighbors[0].wall && Math.round(((this.neighbors[0].wall_offsetHeight) + Number.EPSILON) * 100) / 100 == 0.3): !(this.neighbors[1].wall && Math.round(((this.neighbors[1].wall_offsetHeight) + Number.EPSILON) * 100) / 100 == 0.3);
    

      if (drawWallLeft) {
        push();
        fill(lerpColor(wall_color, shadow, 0.3));
        stroke(lerpColor(wall_color, shadow, 0.4));
        translate(this.x, this.y + (this.h / 2 * this.wall_offsetHeight), this.z + this.d / 2);
        box(this.w, this.h * (this.wall_offsetHeight + 1), 0);
        pop();
      }
      if (drawWallRight) {
        push();
        fill(lerpColor(wall_color, light, 0.3));
        stroke(lerpColor(wall_color, shadow, 0.05));
        translate(this.x + this.w / 2, this.y + (this.h / 2  * this.wall_offsetHeight), this.z);
        box(0, this.h * (this.wall_offsetHeight + 1), this.d);
        pop();
      }

      push();
      stroke(69,61,43);
      fill(wall_color);
      translate(this.x, this.y + (this.h / 2) + (this.h * this.wall_offsetHeight), this.z);
      box(this.w, 0, this.d);
      pop();

    } else {

      // walls if on edge of grid
      if (this.i == 0 && !this.start && !this.end) {
        push();
        fill(lerpColor(this.color, shadow, 0.3));
        stroke(lerpColor(this.color, shadow, 0.4));
        translate(this.x, this.y, this.z + this.d / 2);
        box(this.w, this.h, 0);
        pop();
      }
      if (this.j == 0 && !this.start && !this.end) {
        push();
        fill(lerpColor(this.color, light, 0.3));
        stroke(lerpColor(this.color, shadow, 0.05));
        translate(this.x + this.w / 2, this.y, this.z);
        box(0, this.h, this.d);
        pop();
      }

      if (!this.start && !this.end){
        push();
        fill(this.color);
        stroke(lerpColor(this.color, shadow, 0.2));
        translate(this.x, this.y + this.h/2, this.z);
        box(this.w, 0, this.d);
        pop();
      }

      if (this.wall_offsetHeight >= 0.3) {this.wall_offsetHeight = 0.3}

      if (this.start || this.end) {
        push();
        fill(this.color);
        stroke(lerpColor(this.color, shadow, 0.2));
        translate(this.x, this.y + (this.h / 2) + (this.h * this.wall_offsetHeight), this.z);
        box(this.w, 0, this.d);
        pop();

        push();
        fill(lerpColor(this.color, shadow, 0.3));
        stroke(lerpColor(this.color, shadow, 0.4));
        translate(this.x, this.y + (this.h / 2 * this.wall_offsetHeight), this.z + this.d / 2);
        box(this.w, this.h * (this.wall_offsetHeight + 1), 0);
        pop();

        push();
        fill(lerpColor(this.color, light, 0.3));
        stroke(lerpColor(this.color, shadow, 0.05));
        translate(this.x + this.w / 2, this.y + (this.h / 2  * this.wall_offsetHeight), this.z);
        box(0, this.h * (this.wall_offsetHeight + 1), this.d);
        pop();

        push();
        stroke(68, 42, 7);
        strokeWeight(5);
        noFill();
        if (this.start) {
          translate(0, (this.h / 2) + (this.h * this.wall_offsetHeight), 0);
          rotateX(HALF_PI);
          circle(this.x, this.z, this.d/1.8);
        }
        if (this.end) {
          push();
          translate(this.w / 2, (this.h / 2) + (this.h * this.wall_offsetHeight), this.d / 2);
          line(this.x - 3, this.y, this.z -3, this.x - this.w + 3, this.y, this.z - this.d + 3);
          pop();
          push();
          translate(this.w / 2, (this.h / 2) + (this.h * this.wall_offsetHeight), this.d / 2);
          line(this.x - this.w + 3, this.y, this.z - 3, this.x - 3, this.y, this.z - this.d + 3);
          pop();
        }
        pop();
      }
    }
    pop();
  }


  collision(mx, my) {
    let A = screenPosition(this.x, this.y, this.z),
        B = screenPosition(this.x - this.w, this.y, this.z),
        C = screenPosition(this.x - this.w, this.y, this.z - this.d),
        D = screenPosition(this.x, this.y, this.z - this.d),
        BA = p5.Vector.sub(B, A),
        CA = p5.Vector.sub(C, A),
        area = Math.round(((p5.Vector.cross(BA, CA).mag()) + Number.EPSILON) * 100) / 100;

    let M = createVector(mx, my, 0),
        MA = p5.Vector.sub(A, M),
        MB = p5.Vector.sub(B, M),
        MC = p5.Vector.sub(C, M),
        MD = p5.Vector.sub(D, M);

    let a = p5.Vector.cross(MB,MA).mag() /2,
        b = p5.Vector.cross(MC,MB).mag() /2,
        c = p5.Vector.cross(MD,MC).mag() /2,
        d = p5.Vector.cross(MA,MD).mag() /2;


    if (Math.round(((a+b+c+d) + Number.EPSILON) * 100) / 100 == area) {
      if (this.end || this.start) {
        this.wall_offsetHeight += 0.3 / 7;
        return (this.end)? 'end': 'start';
      } else {
        return true
      }
    } else {
      return false
    }

  }

  addNeighbors(grid, rows, columns) {
    if (this.i > 0) {this.neighbors.push(grid[this.i-1][this.j])}
    if (this.j > 0) {this.neighbors.push(grid[this.i][this.j-1])}
    if (this.i < columns - 1) {this.neighbors.push(grid[this.i+1][this.j])}
    if (this.j < rows - 1) {this.neighbors.push(grid[this.i][this.j+1])}
  }
}