const forms = [{
    name: "form0",
    shape: [[1, 0], [1, 0], [1, 1], [1, 0]],
    position: {row: 8, col: 3}
},{
    name: "form1",
    shape: [[0, 0, 1], [0, 0, 1], [1, 1, 1]],
    position: {row: 4, col: 6}
},{
    name: "form2",
    shape: [[1, 1, 1], [1, 0, 1]],
    position: {row: 0, col: 6}
},{
    name: "form3",
    shape: [[1, 0], [1, 0], [1, 0], [1, 1]],
    position: {row: 8, col: 6}
},{
    name: "form4",
    shape: [[0, 1], [0, 1], [1, 1], [1, 0]],
    position: {row: 8, col: 0}
},{
    name: "form5",
    shape: [[1, 1], [1, 1], [1, 1]],
    position: {row: 0, col: 10}
},{
    name: "form6",
    shape: [[0, 1], [1, 1], [1, 1]],
    position: {row: 4, col: 10}
},{
    name: "form7",
    shape: [[1, 0, 0], [1, 1, 1], [0, 0, 1]],
    position: {row: 8, col: 9}
}
]

let clicked = null;
let clickedOrientation = null;

let currentSquareRow = null;
let currentSquareCol = null;

function createArrayFromTable() {
    const board = document.querySelector('#board');
    const rows = board.children[0].children;
    const arrayBoard = []
    for (const row of rows) {
        arrayBoard.push(row.children);
    }
    return arrayBoard;
}

function getFormByName(name) {
    return forms.filter(element => element.name === name)[0];
}

function isPartOfObject(row, col) {
    let rowDiff;
    let colDiff;
    for (const form of forms) {
        if (row >= form.position.row && col >= form.position.col) {
            rowDiff = row - form.position.row;
            colDiff = col - form.position.col;
            if (rowDiff < form.shape.length && colDiff < form.shape[rowDiff].length && form.shape[rowDiff][colDiff] === 1) {
                return form.name;
            }
        }
    }
    return false;
}

function editBorders(square, rowOffset, colOffset, shape, target) {
    if (rowOffset === 0 || shape[rowOffset - 1][colOffset] === 0) {
        square.style.borderTopWidth = target;
    }
    if (rowOffset === shape.length - 1 || shape[rowOffset + 1][colOffset] === 0) {
        square.style.borderBottomWidth = target;
    }
    if (colOffset === 0 || shape[rowOffset][colOffset - 1] === 0) {
        square.style.borderLeftWidth = target;
    }
    if (colOffset === shape[0].length - 1 || shape[rowOffset][colOffset + 1] === 0) {
        square.style.borderRightWidth = target;
    }
}

/**
 * 
 * @param object: the current form
 * @param action: place|select|unselect|remove
 * @param currentShape: possible overwrite of the shape provided in the form object
 */
function placeOrHighlightOneObject(object, action="place") {
    const board = createArrayFromTable();
    let row = object.position.row;
    let col = object.position.col;
    const shape = action === 'place' && clickedOrientation !== null ? clickedOrientation : object.shape;
    for (let rowOffset = 0; rowOffset < shape.length; rowOffset++) {
        for (let colOffset = 0; colOffset < shape[rowOffset].length; colOffset++) {
            if (shape[rowOffset][colOffset]) {
                const square = board[row + rowOffset][col + colOffset];
                switch (action) {
                    case "place":
                        square.style.backgroundColor = "yellow";
                        square.setAttribute("data-form", object.name + "-" + rowOffset + "-" + colOffset);
                        editBorders(square, rowOffset, colOffset, shape, '4px');
                        break;
                    case "select":
                        square.style.backgroundColor = "teal";
                        break;
                    case "unselect":
                        square.style.backgroundColor = "yellow";
                        break;
                    case "remove":
                        square.style.backgroundColor = "white";
                        square.setAttribute("data-form", "none");
                        editBorders(square, rowOffset, colOffset, shape, '1px')
                        break;
                    default:
                        throw Error("Invalid action");
                }
            }
        }
    }
}

function validatePlacement(row, col) {
    const clickedData = clicked.split('-');
    row -= parseInt(clickedData[1]);
    col -= parseInt(clickedData[2]);
    const board = createArrayFromTable();
    for (let i = 0; i < clickedOrientation.length; i++) {
        for (let j = 0; j < clickedOrientation[i].length; j++) {
            if (clickedOrientation[i][j]) {
                let positionRow = row + i;
                let positionCol = col + j;
                if (positionRow < 0 || positionRow >= board.length || positionCol < 0 || positionCol >= board[positionRow].length) {
                    return false;
                }
                const square = board[positionRow][positionCol];
                if (square.getAttribute("data-form") !== "none" && square.getAttribute("data-form").split('-')[0] !== clickedData[0]) {
                    return false;
                }
            }
        }
    }
    return true;
}

function drawShadow(row, col, valid) {
    const clickedData = clicked.split('-');
    row -= parseInt(clickedData[1]);
    col -= parseInt(clickedData[2]);
    const board = createArrayFromTable();
    for (let i = 0; i < clickedOrientation.length; i++) {
        for (let j = 0; j < clickedOrientation[i].length; j++) {
            if (clickedOrientation[i][j]) {
                let positionRow = row + i;
                let positionCol = col + j;
                if (positionRow >= 0 && positionRow < board.length && positionCol >= 0 && positionCol < board[positionRow].length) {
                    const square = board[positionRow][positionCol];
                    if (valid) {
                        square.style.backgroundColor = "gray";
                    } else {
                        square.style.backgroundColor = "red";
                    }
                }
            }
        }
    }
}

function removeShadows() {
    const board = createArrayFromTable();
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const square = board[i][j];
            if (square.style.backgroundColor === "gray" || square.style.backgroundColor === "red") {
                const check = isPartOfObject(i, j);
                if (check === false) {
                    square.style.backgroundColor = "white";
                } else if (check === clicked.split("-")[0]) {
                    square.style.backgroundColor = "teal";
                } else {
                    square.style.backgroundColor = "yellow";
                }
            }
        }
    }
}

function relocateObject(row, col) {
    const valid = validatePlacement(row, col)
    const clickedData = clicked.split("-");
    const form = getFormByName(clickedData[0]);
    if (valid) { // place it
        placeOrHighlightOneObject(form, "remove");
        row -= parseInt(clickedData[1]);
        col -= parseInt(clickedData[2]);
        form.position.row = row;
        form.position.col = col;
        form.shape = clickedOrientation
        placeOrHighlightOneObject(form, "place");
        clicked = null;
        clickedOrientation = null;
    } else { // unselect
        removeShadows();
        placeOrHighlightOneObject(form, "unselect");
        clicked = null;
        clickedOrientation = null;
    }
}

function flipObject() {
    if (clicked) {
        const height = clickedOrientation.length;
        const width = clickedOrientation[0].length;
        const newOrientation = [];
        for (let i = 0; i < height; i++) {
            const newLine = [];
            for (let j = 0; j < width; j++) {
                newLine.push(clickedOrientation[i][width - 1 - j]);
            }
            newOrientation.push(newLine);
        }
        clickedOrientation = newOrientation;
        const clickedData = clicked.split('-');
        let newCol= width - 1 - parseInt(clickedData[2]);
        newCol = newCol.toString();
        clicked = clickedData[0] + "-" + clickedData[1] + "-" + newCol;
        removeShadows();
        const valid = validatePlacement(currentSquareRow, currentSquareCol);
        drawShadow(currentSquareRow, currentSquareCol, valid);
    }
}

function rotateObject() {
    if (clicked) {
        const height = clickedOrientation.length;
        const width = clickedOrientation[0].length;
        const newOrientation = [];
        for (let i = 0; i < width; i++) {
            const newLine = [];
            for (let j = 0; j < height; j++) {
                newLine.push(clickedOrientation[j][width - 1 - i]);
            }
            newOrientation.push(newLine);
        }
        clickedOrientation = newOrientation;
        const clickedData = clicked.split('-');
        let newRow = width - 1 - parseInt(clickedData[2]);
        let newCol= clickedData[1];
        newRow = newRow.toString();
        clicked = clickedData[0] + "-" + newRow + "-" + newCol;
        removeShadows();
        const valid = validatePlacement(currentSquareRow, currentSquareCol);
        drawShadow(currentSquareRow, currentSquareCol, valid);
    }
}

function selectObject(eventForm) {
    if (clicked) { // an object is already selected
        const oldFormName = clicked.split('-')[0]
        const newFormName = eventForm.split('-')[0];
        if (oldFormName === newFormName) { // place
            relocateObject(currentSquareRow, currentSquareCol);
            return;
        } else {
            placeOrHighlightOneObject(getFormByName(oldFormName), "unselect");
        }
    }
    clicked = eventForm;
    const clickedData = clicked.split('-');
    const form = getFormByName(clickedData[0]);
    clickedOrientation = JSON.parse(JSON.stringify(form.shape));
    placeOrHighlightOneObject(form, "select");
}

function checkWin() {
    
    const board = createArrayFromTable();
    let month = '';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const date = new Date();
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const square = board[i][j];
            if (square.innerHTML !== '' && square.style.backgroundColor === 'white') {
                if (month !== '') {
                    return false;
                }
                month = square.innerHTML;
            }
        }
    }
    month = months.indexOf(month)
    if (month !== date.getMonth()) {
        return false;
    }
    let day = -1;
    for (let i = 2; i < 7; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const square = board[i][j];
            if (square.innerHTML !== '' && square.style.backgroundColor === 'white') {
                if (day !== -1) {
                    return false;
                }
                day = parseInt(square.innerHTML);
            }
        }
    }
    return day === date.getDate()
}

function lockBoard() {
    const board = createArrayFromTable();
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const square = board[i][j];
            if (square.style.backgroundColor === 'yellow') {
                square.style.backgroundColor = 'green';
            }
            square.removeEventListener("mouseover", handleHoverIn);
            square.removeEventListener("mouseout", handleHoverOut);
            square.removeEventListener("click", handleObjectSelection);
        }
    }
}

function handleRotateButton(event) {
    if (event.key === 'r') {
        rotateObject();
    }
}

function handleFlipButton(event) {
    if (event.key === 'f') {
        flipObject();
    }
}

function handleObjectSelection(event) {
    if (event.currentTarget.dataset.form !== "none") { // clicking on object
        removeShadows();
        const eventForm = event.currentTarget.dataset.form;
        const coordinates = event.currentTarget.dataset.coordinate;
        currentSquareRow = parseInt(coordinates.split('-')[0])
        currentSquareCol = parseInt(coordinates.split('-')[1])
        selectObject(eventForm);
    } else if (clicked) { // try to place an object
        const coordinate = event.currentTarget.dataset.coordinate.split("-");
        let row = parseInt(coordinate[0]);
        let col = parseInt(coordinate[1]);
        relocateObject(row, col);
        if (checkWin()) {
            lockBoard();
        }
    }
}

function handleHoverIn(event) {
    if (clicked) {
        const eventData = event.currentTarget.dataset.coordinate.split("-");
        const row = parseInt(eventData[0]);
        const col = parseInt(eventData[1]);
        const valid = validatePlacement(row, col);
        drawShadow(row, col, valid);
        currentSquareRow = row;
        currentSquareCol = col;
    }
}

function handleHoverOut(event) {
    removeShadows();
    currentSquareRow = null;
    currentSquareCol = null;
}

function placeObjects() {
    for (const form of forms) {
        placeOrHighlightOneObject(form);
    }
}

function addHoverEventListenersToFields() {
    const board = createArrayFromTable();
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            const square = board[row][col];
            square.addEventListener("mouseover", handleHoverIn);
            square.addEventListener("mouseout", handleHoverOut);
            square.addEventListener("click", handleObjectSelection);
            square.style.backgroundColor = 'white';
            square.style.borderWidth = '1px';
            square.setAttribute("data-coordinate", row + "-" + col);
            square.setAttribute("data-form", "none");
        }
    }
}

function setup() {
    document.addEventListener("keydown", handleRotateButton);
    document.addEventListener("keydown", handleFlipButton);
    addHoverEventListenersToFields();
    placeObjects();
}

setup();
