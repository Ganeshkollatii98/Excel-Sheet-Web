
/* 
 Representation: [
                  row1 [[0,0],[0,1],[0,2],[0,3]],
                  row2 [],
                  row3 [],
                  row4 [],
                  ] 
*/

let graphComponentMatrix = []
for (let i = 0; i < rows; i++) {
  let row = [];
  for (let j = 0; j < cols; j++) {
    row.push([])
  }
  graphComponentMatrix.push(row)
}

console.log(graphComponentMatrix)
//return  true - cyclic false - not cyclic
let isGraphCyclic = () => {
  /* 
     - initialization visited and pathVisited
     v [[f,f,f,f,...],[f,f,f,f]]
     pv [[f,f,f,f...],[f,f,f,f...]]
  */
  let visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  let pathVisited = Array.from({ length: rows }, () => Array(cols).fill(false));

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (visited[i][j] === false) {
        let response = dfsCycleDetection(graphComponentMatrix, i, j, visited, pathVisited);
        // Found cycle so return immediately, no need to explore more path
        if (response == true) return true;
      }
    }
  }
  return false;
}

/* Start -> vis(TRUE) dfsVis(TRUE)
End -> dfsVis(FALSE)
If vis[i][j] -> already explored path, so go back no use to explore again
Cycle detection condition -> if (vis[i][j] == true && dfsVis[i][j] == true) -> cycle
Return -> True/False
True -> cyclic, False -> Not cyclic */
let dfsCycleDetection = (graphComponentMatrix, srcr, srcc, visited, pathVisited) => {
  // sourceRow and sourceCol
  visited[srcr][srcc] = true;
  pathVisited[srcr][srcc] = true;

  // A1 -> [ [0, 1], [1, 0], [5, 10], .....  ]
  for (let children = 0; children < graphComponentMatrix[srcr][srcc].length; children++) {
    let [nbrr, nbrc] = graphComponentMatrix[srcr][srcc][children];  // [0, 1]
    if (visited[nbrr][nbrc] == false) {
      let response = dfsCycleDetection(graphComponentMatrix, nbrr, nbrc, visited, pathVisited);
      if (response === true) return true; // Found cycle so return immediately, no need to explore more path
    }
    else if (visited[nbrr][nbrc] === true && pathVisited[nbrr][nbrc]) {
      // Found cycle so return immediately, no need to explore more path
      return true;
    }
  }

  pathVisited[srcr][srcc] = false;
  return false;
}