let addSheetBtn = document.querySelector(".sheet-add-icon");
let folderCount = document.querySelector(".sheet-folder-count");
let activeSheetColor = "#ced6e0";
addSheetBtn.addEventListener("click", (event) => {
  let sheetFolder = document.createElement("div");
  sheetFolder.setAttribute("class", "sheet-folder");

  let allSheets = document.querySelectorAll(".sheet-folder");
  sheetFolder.setAttribute("id", allSheets.length);
  sheetFolder.innerText = `Sheet${allSheets.length + 1}`;
  folderCount.appendChild(sheetFolder);
  
  sheetFolder.scrollIntoView();
  createSheetsDB();
  createGraphComponentMatrix();
  handleSheetActiveness(sheetFolder);
  handleSheetRemovel(sheetFolder);
  sheetFolder.click();
});

let createSheetsDB = () => {
  let sheetDB = [];
  // [[cel1Db,cell2Db...],[cel1Db,cell2Db...],[cel1Db,cell2Db...],[cel1Db,cell2Db...]]
  // Adding new object to every [row][col] to access
  for (let i = 0; i < rows; i++) {
    let sheetRow = [];
    for (let j = 0; j < cols; j++) {
      let cellProp = {
        bold: false,
        italic: false,
        underline: false,
        align: "left",
        fontFamily: "Monospace",
        fontSize: "14",
        fontColor: "#000000", // Just indication purpose we added this color
        BGcolor: "#ecf0f1",
        value: "",
        formula: "",
        children: [],
      };
      sheetRow.push(cellProp);
    }
    sheetDB.push(sheetRow);
  }
  collectedSheetsDB.push(sheetDB);
};

let createGraphComponentMatrix = () => {
  let graphComponentMatrix = [];
  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
      row.push([]);
    }
    graphComponentMatrix.push(row);
  }
  collectedGraphComponentMatrix.push(graphComponentMatrix);
};

let handleSheetActiveness = (sheet) => {
  sheet.addEventListener("click", (event) => {
    let sheetIdx = Number(sheet.getAttribute("id"));
    handleSheetDB(sheetIdx);
    handleSheetProperties();
    handleSheetUI(sheet);
  });
};
let handleSheetDB = (sheetIdx) => {
  sheetDB = collectedSheetsDB[sheetIdx];
  graphComponentMatrix = collectedGraphComponentMatrix[sheetIdx];
};

let handleSheetProperties = () => {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let cell = document.querySelector(
        `.cell-cont[rowid="${i}"][colid="${j}"]`
      );
      cell.click();
    }
  }
  // By Default click on first cell and diaply that address in addressBar input via DOM
  let firstcell = document.querySelector(".cell-cont");
  firstcell.click();
};

let handleSheetUI = (sheet) => {
  let allSheets = document.querySelectorAll(".sheet-folder");
  for (let i = 0; i < allSheets.length; i++) {
    allSheets[i].style.backgroundColor = "transparent";
  }
  sheet.style.backgroundColor = activeSheetColor;
};

let handleSheetRemovel = (sheet) => {
  sheet.addEventListener("mousedown", (event) => {
    if (event.button !== 2) return;

    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    if (allSheetFolders.length == 1) {
      alert("You need to have atleast one sheet!");
      return;
    }

    let response = confirm(
      "Your sheet will be permanently removed. Are you sure?"
    );
    if (response == false) return;
    
    let sheetIdx = Number(sheet.getAttribute("id"));
    // Remove Selected one DB
    collectedSheetsDB.splice(sheetIdx, 1);
    collectedGraphComponentMatrix.splice(sheetIdx, 1);


    // Remove sheet from UI
    handleSheetUIRemovel(sheet);

    sheetDB = collectedSheetsDB[0];
    graphComponentMatrix = createGraphComponentMatrix[0];

    handleSheetProperties();
  });
};

let handleSheetUIRemovel = (sheet) => {
  sheet.remove();
  let allSheets = document.querySelectorAll(".sheet-folder");
  for (let i = 0; i < allSheets.length; i++) {
    allSheets[i].setAttribute("id", i);
    allSheets[i].innerText = `Sheet ${i + 1}`;
    allSheets[i].style.backgroundColor = "transparent";
  }
  allSheets[0].style.backgroundColor = activeSheetColor;
};
