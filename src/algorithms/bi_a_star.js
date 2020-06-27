function biAStar() {
  if (openFor.length > 0 && openBack.length > 0) {

    // FORWARD

    current = openFor[0]
    current.visited = [true, false]

    if (current == end || openBack.includes(current)) {
      biPath(current)
      closedSet.push(current)
      progressPercent.innerText = 'Done!'
      progressBar.style.strokeDashoffset = 0
      return false
    }

    openFor.shift()
    closedSet.push(current)

    for (let i = 0; i < current.neighbors.length; i++) {
      let neighbor = current.neighbors[i]
      if (!neighbor.visited[0] && !neighbor.wall) {
        let tentGa = current.ga + 1;
        if (openFor.includes(neighbor)) {
          if (tentGa < neighbor.ga) {
            neighbor.ga = tentGa
          }
        } else {
          neighbor.ga = tentGa
          openFor.push(neighbor)
        }
        neighbor.fa = neighbor.ga + distance(neighbor, end)
        if (neighbor.previous == undefined) neighbor.previous = [undefined, undefined];
        neighbor.previous[0] = current
      }
    }

    // BACKWARD

    current = openBack[0]
    current.visited = [false, true]

    if (current == start || openFor.includes(current)) {
      biPath(current)
      closedSet.push(current)
      progressPercent.innerText = 'Done!'
      progressBar.style.strokeDashoffset = 0
      return false
    }

    openBack.shift()
    closedSet.push(current)

    for (let i = 0; i < current.neighbors.length; i++) {
      let neighbor = current.neighbors[i]
      if (!neighbor.visited[1] && !neighbor.wall) {
        let tentGa = current.ga + 1;
        if (openBack.includes(neighbor)) {
          if (tentGa < neighbor.ga) {
            neighbor.ga = tentGa
          }
        } else {
          neighbor.ga = tentGa
          openBack.push(neighbor)
        }
        neighbor.fa = neighbor.ga + distance(neighbor, start)
        if (neighbor.previous == undefined) neighbor.previous = [undefined, undefined];
        neighbor.previous[1] = current
      }
    }
    
    return true
  } else {
    // no solution
    progressPercent.innerText = 'Error'
    progressBar.style.strokeDashoffset = 0
    progressBar.style.stroke = 'red';
    return false
  }
}