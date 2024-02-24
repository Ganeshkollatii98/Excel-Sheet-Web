let cols = 26;
let rows = 100;

let addressColCont = document.querySelector(".address-bar-col-cont");
let addressRowCont = document.querySelector(".address-bar-row-cont");
let cellsCont = document.querySelector(".cells-cont");
let addressBar = document.querySelector(".address-bar");



// Row - implementation
for (let i = 0; i <= rows; i++) {
  let addressCol = document.createElement("div");
  addressCol.setAttribute("class", "address-col");
  addressCol.innerHTML = i;
  addressColCont.appendChild(addressCol);
}
// Column - implementation
for (let i = 0; i < cols; i++) {
  let addressRow = document.createElement("div");
  addressRow.setAttribute("class", "address-row");
  addressRow.innerHTML = String.fromCharCode(i + 65);
  addressRowCont.appendChild(addressRow);
}

// cells - implementation 
for (let row = 0; row < rows; row++) {
  let rowCount = document.createElement("div");
  rowCount.setAttribute("class", "row-cont");
  for (let col = 0; col < cols; col++) {
    let cell = document.createElement("div");
    cell.setAttribute("class", "cell-cont");
    cell.setAttribute("contenteditable", true);
    // These attribute are used for col indentification
    cell.setAttribute('rowId',row);
    cell.setAttribute('colId',col);
    rowCount.appendChild(cell);
    addListenerForAddressBarDisplay(cell,row,col);
  }
  cellsCont.appendChild(rowCount);
}
// On clicking on any of the cell we are displaying cell on the address bar
function addListenerForAddressBarDisplay(cell,row,col){
    cell.addEventListener('click',(event)=>{
        let rowID=row;
        let colID=String.fromCharCode(65+col);
        addressBar.value=`${colID}${rowID+1}`
    })
}

// By Default click on first cell and diaply that address in addressBar input via DOM
let cell =  document.querySelector('.cell-cont')
cell.click();





