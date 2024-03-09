let colorPromise = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 1000)
    })
}

let isGraphCyclicTracePath = async (graphComponentMatrix, cycleResponse) => {
    let [srcr, srcc] = cycleResponse;
    let visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    let pathVisited = Array.from({ length: rows }, () => Array(cols).fill(false));
    
    let response = await dfsCycleDetectionTracePath(graphComponentMatrix, srcr, srcc, visited, pathVisited);
    if (response) return Promise.resolve(true);

   return Promise.resolve(false);
}


// Coloring cells for tracking
let dfsCycleDetectionTracePath = async (graphComponentMatrix, srcr, srcc, visited, pathVisited) => {
    // sourceRow and sourceCol
    visited[srcr][srcc] = true;
    pathVisited[srcr][srcc] = true;
    let cell = document.querySelector(`.cell-cont[rowid="${srcr}"][colid="${srcc}"]`);
    cell.style.backgroundColor = 'lightblue';
    await colorPromise();
    // A1 -> [ [0, 1], [1, 0], [5, 10], .....  ]
    for (let children = 0; children < graphComponentMatrix[srcr][srcc].length; children++) {
        let [nbrr, nbrc] = graphComponentMatrix[srcr][srcc][children];  // [0, 1]
        if (visited[nbrr][nbrc] == false) {
            let response = await dfsCycleDetectionTracePath(graphComponentMatrix, nbrr, nbrc, visited, pathVisited);
            if (response === true) {
                cell.style.backgroundColor = 'transparent';
                await colorPromise();

                return Promise.resolve(true);

            } // Found cycle so return immediately, no need to explore more path
        }
        else if (visited[nbrr][nbrc] === true && pathVisited[nbrr][nbrc]) {
            // Found cycle so return immediately, no need to explore more path
            let cyclicCell = document.querySelector(`.cell-cont[rowid="${nbrr}"][colid="${nbrc}"]`);
            cyclicCell.style.backgroundColor = 'lightsalmon';
            await colorPromise();

            cyclicCell.style.backgroundColor = 'transparent';
            cell.style.backgroundColor = "transparent";
            await colorPromise();


            return Promise.resolve(true);
        }
    }

    pathVisited[srcr][srcc] = false;
    return Promise.resolve(false);
}