/* 
  - Here we will get all cells  when user clicks and entered somthing
    and when he clicked on other cell it will fired 
*/
allCells.forEach((cell) => {
  cell.addEventListener("blur", (event) => {
    // accessing cell
    let [activeCell, cellProperties] = getActiveCellandCellProp(
      addressBar.value
    );
    let enteredData = activeCell.innerText;

    if (enteredData == cellProperties.value) return;

    // we are chaning value in cellpropeties
    cellProperties.value = enteredData;
    // If data is modified remove P-C relation, formula empty, update children
    // with new hardcoded (modified ) value

    /* 
       Changing already set value - hardcoded value
 - When user have formula in that cell. but 
   he typed some value on cell. so
   Step-1 there is no use of formula right need to romove that formula
 - Parent child relation also to be removed
 - update children cells
  
    */
    removeChildFromParent(cellProperties.formula);
    cellProperties.formula = "";
    updateChildrenCells(addressBar.value);
  });
});

// formula evalution
let formulaBar = document.querySelector(".formula-bar");

formulaBar.addEventListener("keydown", (event) => {
  let inputFormula = formulaBar.value;
  if (inputFormula && event.key === "Enter") {
    // if there is chanage in previous formula and current formula,
    // BreakDown Parent -child relation, evalute new formula , add new parent-child formula
    let address = addressBar.value;
    let [cell, cellProp] = getActiveCellandCellProp(address);
    if (cellProp.formula != inputFormula)
      removeChildFromParent(cellProp.formula);

    addChildToGraphComponent(inputFormula, address);
    // check formula is cyclic or not ,then only evalute
    //  return True if cyclic return false if not cyclic
    console.log("added", graphComponentMatrix)

    let isCyclic = isGraphCyclic();
    if (isCyclic) {
      alert("Your formula is cyclic");
      removeChildFromGraphComponent(inputFormula, address);
      console.log("cyc", graphComponentMatrix)
      return;
    }
    console.log(graphComponentMatrix)
    let evalutedValue = evaluteFormula(inputFormula);

    //  Update UI and cellProp in DB
    setCellUIandCellProp(evalutedValue, inputFormula, address);
    addChildToParent(inputFormula);

    updateChildrenCells(address);
  }
});

let addChildToGraphComponent = (formula, childAddress) => {
  // Example: formula is A1+10  and childAddress is B1
  let [ccid, crid] = decodeRIDCIDfromAddress(childAddress);
  let encodedFormula = formula.split(' ');
  for (let encodeAdd of encodedFormula) {
    let assciiValue = encodeAdd.charCodeAt(0);
    if (assciiValue >= 65 && assciiValue <= 90) {
      // we got A1 location [0,0]
      let [pcid, prid] = decodeRIDCIDfromAddress(encodeAdd);
      graphComponentMatrix[pcid][prid].push([ccid, crid]);
    }
  }
}

let removeChildFromGraphComponent = (formula, childAddress) => {
  // Example: formula is A1+10  and childAddress is B1
  let [ccid, crid] = decodeRIDCIDfromAddress(childAddress);
  let encodedFormula = formula.split(' ');
  for (let encodeAdd of encodedFormula) {
    let assciiValue = encodeAdd.charCodeAt(0);
    if (assciiValue >= 65 && assciiValue <= 90) {
      // we got A1 location [0,0]
      let [pcid, prid] = decodeRIDCIDfromAddress(encodeAdd);
      //  whatever cycleic address inserted we are removing that
      graphComponentMatrix[pcid][prid].pop();
    }
  }
}

let addChildToParent = (formula) => {
  /* 
       A1 = 10
       B1 = A1 + 100
       when ever we change value in A1 , B1 is also dependent on A1 so we will update 
       B1 as well, so add A1 has children. so add B1 to A1 Childeren 
    */
  let childAddress = addressBar.value;
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let assciiValue = encodedFormula[i].charCodeAt(0);
    if (assciiValue >= 65 && assciiValue <= 90) {
      let [parentCell, parentCellProp] = getActiveCellandCellProp(
        encodedFormula[i]
      );
      parentCellProp.children.push(childAddress);
    }
  }
};

let removeChildFromParent = (formula) => {
  /* 
      Example:
      A1 = 10  - >  A1 cellProp.children['B1']
      A2 = 20  - >  A1 cellProp.children['B1']
      B1 = A1+A2 

      so iam going to change B1 formula to A1 + 10
      B1 = A1+10
      Update A2 Children
      so i need to remove B1 children from A2 right 
    */
  let childAddress = addressBar.value;
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let assciiValue = encodedFormula[i].charCodeAt(0);
    if (assciiValue >= 65 && assciiValue <= 90) {
      let [parentCell, parentCellProp] = getActiveCellandCellProp(
        encodedFormula[i]
      );
      let idx = parentCellProp.children.indexOf(childAddress);
      parentCellProp.children.splice(idx, 1);
    }
  }
};
let evaluteFormula = (formula) => {
  /* 
     ~~~ dependency
     formula="A1 + 10"
     split it => ['A1','+','10']
     convert address forumula [0] to ascci value it should between A to Z 
     once we get Cell and cellProp
     change there index to value of that address
     decode it and evalute epxp
  */
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [cell, cellProp] = getActiveCellandCellProp(encodedFormula[i]);
      encodedFormula[i] = cellProp.value;
    }
  }
  let decodedFormula = encodedFormula.join(" ");
  return eval(decodedFormula);
};
// Recursivly updating the childrens
function updateChildrenCells(parentAddress) {
  /* 
    A1 = 10  children=[B1]
A2 = 20  children=[B1]
B1= A1 + A2
C1= B1+10
E1 =C1 +30

Changing A1 =20 okay:
    1. we need update children value as well right
Just loop on parent childrens and take one by one and evalute 

  */
  let [parentCell, parentCellProp] = getActiveCellandCellProp(parentAddress);
  let children = parentCellProp.children;

  //  Childrens value updation
  for (let i = 0; i < children.length; i++) {
    let childAddress = children[i];
    let [childCell, childCellProp] = getActiveCellandCellProp(childAddress);
    let childFormula = childCellProp.formula;

    let evaluatedValue = evaluteFormula(childFormula);
    setCellUIandCellProp(evaluatedValue, childFormula, childAddress);
    updateChildrenCells(childAddress);
  }
}

let setCellUIandCellProp = (evalutedValue, formula, address) => {
  let [activeCell, cellProp] = getActiveCellandCellProp(address);
  // Update Ui
  activeCell.innerText = evalutedValue;

  // DB Update
  cellProp.value = evalutedValue;
  cellProp.formula = formula;
};
