let depth = 0,
    bestNode = undefined;

function biAStarRetarg() {
  if (openFor.length > 0 && openBack.length > 0) {
    current = openFor[0]
    return true
  } else {
    // no solution
    progressPercent.innerText = 'Error'
    progressBar.style.strokeDashoffset = 0
    progressBar.style.stroke = 'red';
    return false
  }
}