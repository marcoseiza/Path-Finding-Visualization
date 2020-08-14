function aStarStepped() {
  if (openSet.length > 0) {
    current = openSet[0];

    if (current == end) {
      var temp = current;
      path.push(temp);
      while (temp.previous) {
        path.push(temp.previous);
        temp = temp.previous;
      }
      progressPercent.innerText = 'Done!';
      progressBar.style.strokeDashoffset = 0;
      return false;
    }

    openSet.shift();
    closedSet.push(current);
    current.visited = true;

    for (var i = 0; i < current.neighbors.length; i++) {
      var neighbor = current.neighbors[i];
      if (!neighbor.visited && !neighbor.wall) {
        var tentGa = current.ga + 1;
        if (openSet.includes(neighbor)) {
          if (tentGa < neighbor.ga) {
            neighbor.ga = tentGa;
          }
        } else {
          neighbor.ga = tentGa;
          openSet.push(neighbor)
        }
        neighbor.fa = neighbor.ga + neighbor.ha;
        neighbor.previous = current;
      }
    }
    return true;

  } else {
    // no solution
    progressPercent.innerText = 'Error';
    progressBar.style.strokeDashoffset = 0;
    progressBar.style.stroke = 'red';
    return false;
  }
}