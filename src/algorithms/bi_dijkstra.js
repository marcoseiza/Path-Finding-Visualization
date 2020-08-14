let openFor = [],
    openBack = [],
    closedFor = [],
    closedBack = [],
    p = Infinity;
    pNode = undefined;

function biPath(current) {
  var temp = current;
  path.push(temp);
  while (temp.previous[0]) {
    path.push(temp.previous[0]);
    temp = temp.previous[0];
    if (temp.start) {
      temp.previous = [undefined, undefined];
    }
  }
  temp = current;
  while (temp.previous[1]) {
    path.push(temp.previous[1]);
    temp = temp.previous[1];
    if (temp.end) {
      temp.previous = [undefined, undefined];
    }
  }
  progressPercent.innerText = 'Done!';
  progressBar.style.strokeDashoffset = 0;
}

function biDijkstra() {
  if (openFor.length > 0 && openBack.length > 0) {
    currentFor = openFor[0];
    currentBack = openBack[0];
    currentFor.visited = [true, false];
    currentBack.visited = [false, true];

    if (currentFor.fa + currentBack.fa + 1 >= p) {
      biPath(pNode);
      return false;
    }
    
    // FORWARD

    openFor.shift();
    closedFor.push(currentFor);

    for (let i = 0; i < currentFor.neighbors.length; i++) {
      let neighbor = currentFor.neighbors[i];

      if (!neighbor.visited[0] && !neighbor.wall) {
        let tentFa = currentFor.fa + 1;;
        if (openFor.includes(neighbor)) {
          if (tentFa < neighbor.fa) {
            neighbor.fa = tentFa;
          }
        } else {
          neighbor.fa = tentFa;
          openFor.push(neighbor);
        }
        if (neighbor.previous == undefined) neighbor.previous = [undefined, undefined];
        neighbor.previous[0] = currentFor;

        if (neighbor.end) {
          biPath(neighbor);
          progressPercent.innerText = 'Done!';
          progressBar.style.strokeDashoffset = 0;
          return false;
        }
      }
      if (!neighbor.end && openBack.includes(neighbor) && neighbor.previous[0].fa + neighbor.previous[1].fa + 2 < p) {
        p = neighbor.previous[0].fa + neighbor.previous[1].fa + 2;
        pNode = neighbor;
      } 
    }

    // BACKWARD

    openBack.shift();
    closedBack.push(currentBack);

    for (let i = 0; i < currentBack.neighbors.length; i++) {
      let neighbor = currentBack.neighbors[i];

      if (!neighbor.visited[1] && !neighbor.wall) {
        let tentFa = currentBack.fa + 1;;
        if (openBack.includes(neighbor)) {
          if (tentFa < neighbor.fa) {
            neighbor.fa = tentFa;
          }
        } else {
          neighbor.fa = tentFa;
          openBack.push(neighbor);
        }
        if (neighbor.previous == undefined) neighbor.previous = [undefined, undefined];
        neighbor.previous[1] = currentBack;

        if (neighbor.start) {
          biPath(neighbor);
          return false;
        }
      }
      if (!neighbor.start && openFor.includes(neighbor) && neighbor.previous[0].fa + neighbor.previous[1].fa + 2 < p) {
        p = neighbor.previous[0].fa + neighbor.previous[1].fa + 2;
        pNode = neighbor;
      }
    }
    
    
    return true
  } else {
    // no solution
    console.log(p, openFor, openBack);
    // if (p < Infinity) {
    //   biPath(pNode);
    //   return false
    // }
    progressPercent.innerText = 'Error';
    progressBar.style.strokeDashoffset = 0;
    progressBar.style.stroke = 'red';
    return false
  }
}