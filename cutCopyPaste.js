let ctrlKey; // this is for ctrl+click
let copyBtn = document.querySelector('.copy');
let pasteBtn = document.querySelector('.paste');
let cutBtn = document.querySelector('.cut');

document.addEventListener('keydown', (event) => {
    ctrlKey = event.ctrlKey
})
document.addEventListener('keyup', (event) => {
    ctrlKey = event.ctrlKey
})

let rangeStorage = [];
let handelSelectedCells = (cell) => {
    cell.addEventListener('click', (event) => {
        if (!ctrlKey) return;
        //  range should be start and end 
        if (rangeStorage.length >= 2) {
            defaultSelectedCellsUI();
            rangeStorage = [];
        }

        cell.style.border = '3px solid green'
        let rowId = Number(cell.getAttribute('rowid'));
        let colId = Number(cell.getAttribute('colid'));
        rangeStorage.push([rowId, colId]);
    })
}
let defaultSelectedCellsUI = () => {
    for (let i = 0; i < rangeStorage.length; i++) {
        let cell = document.querySelector(`.cell-cont[rowid="${rangeStorage[i][0]}"][colid="${rangeStorage[i][1]}"]`)
        cell.style.border = '1px solid lightgray';
    }
}
allCells.forEach((cell) => {
    handelSelectedCells(cell);
})

// Note: Copy functionality;
let copyData = [];
copyBtn.addEventListener('click', () => {
    if(rangeStorage.length>2 )return;

    copyData = []
    let [srtRow, srtCol, endRow, endCol] = [ rangeStorage[0][0], rangeStorage[0][1], rangeStorage[1][0], rangeStorage[1][1] ];

    for (let i = srtRow; i <= endRow; i++) {
        let copyRow = []
        for (let j = srtCol; j <= endCol; j++) {
            let cellProp = sheetDB[i][j];
            copyRow.push(cellProp)
        }
        copyData.push(copyRow)
    }
    defaultSelectedCellsUI();
})

cutBtn.addEventListener("click", (e) => {
    if (rangeStorage.length < 2) return;

    let [strow, stcol, endrow, endcol] = [ rangeStorage[0][0], rangeStorage[0][1], rangeStorage[1][0], rangeStorage[1][1] ];

    for (let i = strow;i <= endrow;i++) {
        for (let j = stcol;j <= endcol;j++) {
            let cell = document.querySelector(`.cell-cont[rowid="${i}"][colid="${j}"]`)

            // DB
            let cellProp = sheetDB[i][j];
            cellProp.value = "";
            cellProp.bold = false;
            cellProp.italic = false;
            cellProp.underline = false;
            cellProp.fontSize = 14;
            cellProp.fontFamily = "monospace";
            cellProp.fontColor = "#000000";
            cellProp.BGcolor = "#000000";
            cellProp.align = "left";

            // UI
            cell.click();
        }
    }

    defaultSelectedCellsUI();
})

pasteBtn.addEventListener('click', () => {
    // dont allow to paste in same cell
    if(rangeStorage.length>2 )return;
    /* 
       rowStorage [[0,0],[2,3]]
       rowDiff = 0-2=abs(2)
       colDiff=0-3 =abs(3)
    */
    let rowDiff = Math.abs(rangeStorage[0][0] - rangeStorage[1][0]);
    let colDiff = Math.abs(rangeStorage[0][1] - rangeStorage[1][1]);

    // target
    let address = addressBar.value;
    let [startRow, startCol] = decodeRIDCIDfromAddress(address);
    // r refers copy data row
    // c refers copy data col

    for (let i = startRow, r = 0; i <= startRow + rowDiff; i++, r++) {
        for (let j = startCol, c = 0; j <= startCol + colDiff; j++, c++) {
            let cell = document.querySelector(`.cell-cont[rowid="${i}"][colid="${j}"]`)
            if (!cell) continue;

            // Update DB
            let data = copyData[r][c];
            let cellProp = sheetDB[i][j];

            cellProp.value = data.value;
            cellProp.bold = data.bold;
            cellProp.italic = data.italic;
            cellProp.underline = data.underline;
            cellProp.fontSize = data.fontSize;
            cellProp.fontFamily = data.fontFamily;
            cellProp.fontColor = data.fontColor;
            cellProp.BGcolor = data.BGcolor;
            cellProp.align = data.align;
            
            cell.click();

        }
    }
})


