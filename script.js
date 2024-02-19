let cols = 100;
let rows = 26;

let addressColCont = document.querySelector(".address-bar-col-cont");
let addressRowCont = document.querySelector(".address-bar-row-cont");
let cellsCont = document.querySelector(".cells-cont");
let addressBar = document.querySelector(".address-bar");

for (let i = 1; i <= cols; i++) {
  let addressCol = document.createElement("div");
  addressCol.setAttribute("class", "address-col");
  addressCol.innerHTML = i;
  addressColCont.appendChild(addressCol);
}

for (let i = 0; i < rows; i++) {
  let addressRow = document.createElement("div");
  addressRow.setAttribute("class", "address-row");
  addressRow.innerHTML = String.fromCharCode(i + 65);
  addressRowCont.appendChild(addressRow);
}

for (let col = 0; col < cols; col++) {
  let rowCount = document.createElement("div");
  rowCount.setAttribute("class", "row-cont");
  for (let row = 0; row < rows; row++) {
    let cell = document.createElement("div");
    cell.setAttribute("class", "cell-cont");
    cell.setAttribute("contenteditable", true);
    rowCount.appendChild(cell);
    addListenerForAddressBarDisplay(cell,row,col);
  }
  cellsCont.appendChild(rowCount);
}

function addListenerForAddressBarDisplay(cell,row,col){
    cell.addEventListener('click',(event)=>{
        let rowID=row;
        let colID=String.fromCharCode(65+rowID);
        addressBar.value=`${colID}${col}`
    })
}


