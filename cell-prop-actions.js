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
    };
    sheetRow.push(cellProp);
  }
  sheetDB.push(sheetRow);
}

// Selectors
let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontColor = document.querySelector(".font-color-prop");
let bgColor = document.querySelector(".font-bgcolor-prop");
let fontSize = document.querySelector(".font-size-prop");
let fontFamily = document.querySelector(".font-family-prop");
let alignment = document.querySelectorAll(".alignment");
let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];

let activeColorProp = "#d1d8e0";
let inactiveColorProp = "#ecf0f1";

/* 
   *Applications of two-way-binding 
   *Attach property listeners
    - here we will get active cell address , based on that address we can decode and 
    - get Mat[row][col] object from sheetDB 
 */

bold.addEventListener("click", (e) => {
  let addressValue = addressBar.value;
  let [cell, cellProperties] = getActiveCell(addressValue);
  // Modification in ui
  cellProperties.bold = !cellProperties.bold; //toggling will happen here
  cell.style.fontWeight = cellProperties.bold ? "bold" : "normal"; // changing cell text to bold
  bold.style.backgroundColor = cellProperties.bold
    ? activeColorProp
    : inactiveColorProp; // changing state to active or inactive
});

italic.addEventListener("click", (e) => {
  let addressValue = addressBar.value;
  let [cell, cellProperties] = getActiveCell(addressValue);
  // Modification in ui
  cellProperties.italic = !cellProperties.italic; //toggling will happen here
  cell.style.fontStyle = cellProperties.italic ? "italic" : "normal"; // changing cell text to bold
  italic.style.backgroundColor = cellProperties.italic
    ? activeColorProp
    : inactiveColorProp; // changing state to active or inactive
});

underline.addEventListener("click", (e) => {
  let addressValue = addressBar.value;
  let [cell, cellProperties] = getActiveCell(addressValue);
  // Modification in ui
  cellProperties.underline = !cellProperties.underline; //toggling will happen here
  cell.style.textDecoration = cellProperties.underline ? "underline" : "none"; // changing cell text to bold
  underline.style.backgroundColor = cellProperties.underline
    ? activeColorProp
    : inactiveColorProp; // changing state to active or inactive
});

fontSize.addEventListener("change", (e) => {
  let addressValue = addressBar.value;
  let [cell, cellProperties] = getActiveCell(addressValue);
  // Modification in ui
  cellProperties.fontSize = fontSize.value;
  cell.style.fontSize = cellProperties.fontSize + "px";
  fontSize.value = cellProperties.fontSize;
});

fontFamily.addEventListener("change", (e) => {
  let addressValue = addressBar.value;
  let [cell, cellProperties] = getActiveCell(addressValue);
  // Modification in ui
  cellProperties.fontFamily = fontFamily.value;
  cell.style.fontFamily = cellProperties.fontFamily;
  fontFamily.value = cellProperties.fontFamily;
});

fontColor.addEventListener("change", (event) => {
  let addressValue = addressBar.value;
  let [cell, cellProperties] = getActiveCell(addressValue);
  // Modification in ui

  cellProperties.fontColor = fontColor.value;
  cell.style.color = cellProperties.fontColor;
  fontColor.value = cellProperties.fontColor;
});

bgColor.addEventListener("change", (event) => {
  let addressValue = addressBar.value;
  let [cell, cellProperties] = getActiveCell(addressValue);
  // Modification in ui
  cellProperties.BGcolor = bgColor.value;
  cell.style.backgroundColor = cellProperties.BGcolor;
  bgColor.value = cellProperties.BGcolor;
});

alignment.forEach((alignEle) => {
  alignEle.addEventListener("click", (event) => {
    let addressValue = addressBar.value;
    let [cell, cellProperties] = getActiveCell(addressValue);

    // alignment setting
    let alignValue = event.target.classList[0];
    cellProperties.align = alignValue;
    cell.style.textAlign = cellProperties.align;

    // based on user click activating left and deactivating right and center
    switch (alignValue) {
      case "left":
        leftAlign.style.backgroundColor = activeColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case "center":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = activeColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case "right":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = activeColorProp;
        break;
    }
  });
});

// default functionality of cells containiers

let allCells = document.querySelectorAll(".cell-cont");

allCells.forEach((cell) => {
  addListenerToAttachCellProperties(cell);
});

function addListenerToAttachCellProperties(cell) {
  cell.addEventListener("click", (event) => {
    let addressValue = addressBar.value;
    let [rid, cid] = decodeRIDCIDfromAddress(addressValue);
    let cellProp = sheetDB[rid][cid];

    // apply existing cell properties on click any cell
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
    cell.style.textDecoration = cellProp.underline ? "underline" : "none";
    cell.style.fontSize = cellProp.fontSize + "px";
    cell.style.fontFamily = cellProp.fontFamily;
    cell.style.color = cellProp.fontColor;
    cell.style.backgroundColor = cellProp.BGcolor === "#000000" ? "transparent" : cellProp.BGcolor;
    cell.style.textAlign = cellProp.align;

    // Apply properties UI Props container
    bold.style.backgroundColor = cellProp.bold
      ? activeColorProp
      : inactiveColorProp;
    italic.style.backgroundColor = cellProp.italic
      ? activeColorProp
      : inactiveColorProp;
    underline.style.backgroundColor = cellProp.underline
      ? activeColorProp
      : inactiveColorProp;
    fontColor.value = cellProp.fontColor;
    fontSize.value = cellProp.fontSize;
    bgColor.value = cellProp.BGcolor;
    fontFamily.value = cellProp.fontFamily;
 
   
    switch (cellProp.align) {
      case "left":
        leftAlign.style.backgroundColor = activeColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case "center":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = activeColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case "right":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = activeColorProp;
        break;
    }
  });
}

function getActiveCell(address) {
  let [rid, cid] = decodeRIDCIDfromAddress(address);
  let cell = document.querySelector(
    `.cell-cont[rowid="${rid}"][colid="${cid}"]`
  ); // selecting particular cell
  let cellProperties = sheetDB[rid][cid]; // getting particular cell properties for cell
  return [cell, cellProperties];
}

function decodeRIDCIDfromAddress(address) {
  // we are taking rowId values from "A1" 1 index and convert to NUMBER
  const rid = Number(address.slice(1))-1;
  const cid = Number(address.charCodeAt(0)) - 65; // we are converting col address ex: 'A'  -> 65 -> substracting with 65
  return [rid, cid];
}
