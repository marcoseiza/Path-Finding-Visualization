function djik() {
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
      return false
    }

    openSet.shift()
    closedSet.push(current);
    current.visited = true;

    for (var i = 0; i < current.neighbors.length; i++) {
      var neighbor = current.neighbors[i];
      if (!neighbor.visited && !neighbor.wall) {
        var tentFa = current.fa + 1;
        if (openSet.includes(neighbor)) {
          if (tentFa < neighbor.fa) {
            neighbor.fa = tentFa;
          }
        } else {
          neighbor.fa = tentFa;
          openSet.push(neighbor);
        }
        neighbor.previous = current;
      }
    }
    return true
  } else {
    // no solution
    progressPercent.innerText = 'Error';
    progressBar.style.strokeDashoffset = 0;
    progressBar.style.stroke = 'red';
    return false
  }
}