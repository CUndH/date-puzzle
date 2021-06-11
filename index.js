const puzzleMap = {
  'puzzle-1': [
    [0,1,1,1],
    [1,1,0,0],
  ],
  'puzzle-2': [
    [1,1,1,1],
    [0,0,1,0],
  ],
  'puzzle-3': [
    [1,1,1,1],
    [0,0,0,1],
  ],
  'puzzle-4': [
    [1,0,0],
    [1,1,1],
    [0,0,1],
  ],
  'puzzle-5': [
    [1,1,1],
    [0,0,1],
    [0,0,1],
  ],
  'puzzle-6': [
    [1,1,1],
    [1,0,1],
  ],
  'puzzle-7': [
    [1,1,1],
    [1,1,1],
  ],
  'puzzle-8': [
    [1,1,1],
    [0,1,1],
  ],
}

let boardMatrix = [];
const boardLocationMap = new Map();

function createBoard() {
  const mainer = document.getElementsByClassName('mainer')[0];

  let row = [];
  // 日期排最后少一格，加入一格空字符串方便遍历
  const dateStrArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', '', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec', ''];
  for (let i = 0; i < 49; i++) {
    if (!(i % 7)) {
      // 0 代表不可填入，1代表可填入，2代表已填入
      row = [];
    }
    let cell = document.createElement('div');
    if (i < 14) {
      if (dateStrArr[i]) {
        cell.innerHTML = dateStrArr[i];
        row.push(1);
      } else {
        cell.setAttribute('class', 'cell-disabled');
        row.push(0);
      }
    } else if (i < 45) {
      cell.innerHTML = i - 13;
      row.push(1);
    } else {
      cell.setAttribute('class', 'cell-disabled');
      row.push(0);
    }
    
    if (!((i + 1) % 7) && i) {
      boardMatrix.push(row);
    }

    cell.classList.add('cell');
    mainer.appendChild(cell);
  }

  const cells = document.getElementsByClassName('cell');
  let rowIndex = -1;
  for (let i = 0; i < cells.length; i++) {
    if (i % 7 === 0) {
      rowIndex ++;
    }
    // 根据棋盘格在矩阵中的位置以及它的绝对位置做一个映射
    boardLocationMap.set([i % 7, rowIndex], [cells[i].offsetLeft + mainer.offsetLeft + 6, cells[i].offsetTop + mainer.offsetTop + 6]);
  }
}

// 生成拼块
function createSegment(matrix, className) {
  return new Promise((resolve) => {
    const segment = document.getElementsByClassName(className)[0];
    segment.style.width = matrix[0].length * 60 + 'px';
    segment.style.height = matrix.length * 60 + 'px';
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        let segmentCell = document.createElement('div');
        segmentCell.className = 'puzzle-cell';
        if (matrix[i][j]) {
          segmentCell.style.backgroundColor = 'rgba(219,112,147,0.5)';
          if (i === 0) {
            segmentCell.style.borderTop = '1px solid #DC143C';
          }
          if (matrix[i][j - 1] === 0) {
            segmentCell.style.borderLeft = '1px solid #DC143C';
          }
          if (matrix[i][j + 1] === 0) {
            segmentCell.style.borderRight = '1px solid #DC143C';
          }
          if (j === 0) {
            segmentCell.style.borderLeft = '1px solid #DC143C';
          }
          if (matrix[i - 1] && matrix[i - 1][j] === 0) {
            segmentCell.style.borderTop = '1px solid #DC143C';
          }
          if (matrix[i + 1] && matrix[i + 1][j] === 0) {
            segmentCell.style.borderBottom = '1px solid #DC143C';
          }
          if (j === matrix[i].length - 1) {
            segmentCell.style.borderRight = '1px solid #DC143C';
          }
          if (i === matrix.length - 1) {
            segmentCell.style.borderBottom = '1px solid #DC143C';
          }
        }
        segment.appendChild(segmentCell);
      }    
    }
    resolve(segment);
  })
}

// 删除拼块
function deleteSegment(className) {
  return new Promise((resolve) => {
    const puzzle = document.getElementsByClassName(className)[0];
    let segments = puzzle.getElementsByClassName('puzzle-cell');
    while (segments.length) {
      puzzle.removeChild(segments[0]);
    }
    resolve();
  })
}

function easyCloneArr(arr) {
  let cloneArr = [];
  if (Array.isArray(arr)) {
    for (let i = 0; i < arr.length; i++) {
      cloneArr.push(Array.isArray(arr[i]) ? easyCloneArr(arr[i]) : arr[i]);
    }
  }
  return cloneArr;
}



function flipMatrix(matrix) {
  for(var i = 0; i < Math.floor(matrix.length / 2); i++){
    for(var j = i; j < matrix[i].length; j++){
      let flag = matrix[i][j];
      matrix[i][j] = matrix[matrix.length - 1][j];
      matrix[matrix.length - 1 - i][j] = flag;
    }
  }
  return matrix;
}

function rotateMatrix(matrix) {
  const m = matrix.length, n = matrix[0].length;
  const transposed = new Array(n).fill(0).map(() => new Array(m).fill(0));
  for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
          transposed[j][i] = matrix[i][j];
      }
  }
  for(var i = 0; i < transposed.length; i++){
    transposed[i].reverse()
  }
  return transposed;
}

function initPuzzle() {
  function getCellIndex(currentPuzzle) {
    for (let j = 0; j < currentPuzzle.length; j++) {
      for (let k = 0; k < currentPuzzle[j].length; k++) {
          // 第一行必定有块，只需要取x坐标即可
          if (currentPuzzle[j][k]) {
            return k;
          }
      }
    }
    return 0;
  }

  function canPuzzleIn(curPuzzle, adsorbLocation) {
    // 棋盘矩阵的指针
    let [curX, curY] = adsorbLocation;

    let newMatrix = easyCloneArr(boardMatrix);

    for (let j = 0; j < curPuzzle.length; j++) {
      for (let k = 0; k < curPuzzle[j].length; k++) {
        if (curPuzzle[j][k]) {
          if (newMatrix[curY][curX] === 1) {
            newMatrix[curY][curX] ++;
            curX ++;
          } else {
            return false;
          }
        } else {
          curX ++;
        }
      }
      curX = curX - curPuzzle[j].length;
      curY ++;
    }
    boardMatrix = newMatrix;
    return true;
  }

  const puzzle = document.getElementsByClassName('puzzle');
  for (let i = 0; i < puzzle.length; i++) {
    puzzle[i].onmousedown = (e) => {
      let current = e.target.parentNode;
      let currentPuzzle = puzzleMap[current.classList[1]];

      let layerX = e.layerX;
      let layerY = e.layerY;

      let offsetY = null;
      let offsetX = null;

      document.body.onmousemove = (e) => {
        offsetY = e.pageY - layerY;
        offsetX = e.pageX - layerX;
        puzzle[i].style.top = offsetY + 'px';
        puzzle[i].style.left = offsetX + 'px';
      }

      document.onkeydown = (e) => {
        if (e.code === 'KeyR') {
          const lastDeg = current.style.transform.replace(/[^0-9]/ig, '');
          current.style.transform = `rotateZ(${lastDeg ? Number(lastDeg) + 90 : 90}deg)`;
          puzzleMap[current.classList[1]] = rotateMatrix(puzzleMap[current.classList[1]]);
        }

        if (e.code === 'KeyE') {
          const lastDeg = current.style.transform.replace(/[^0-9]/ig, '');
          current.style.transform = `rotateX(${lastDeg ? Number(lastDeg) + 180 : 180}deg)`;
          // const originPuzzleMatrix = easyCloneArr(currentPuzzle);
          puzzleMap[current.classList[1]] = flipMatrix(puzzleMap[current.classList[1]]);
        }
      }

      document.body.onmouseup = (e) => {
        let className = current.classList[1];
        deleteSegment(className).then(() => {
          return createSegment(puzzleMap[className], className);
        }).then(copyPuzzle => {
          current = copyPuzzle;

          // 找到拼块左上角块来做吸附的锚点，无论是不是有效块
          const currentLocalCell = copyPuzzle.getElementsByClassName('puzzle-cell')[0];

          let minus = [];
          let curCellLeft = currentLocalCell.getBoundingClientRect().left;
          let curCellTop = currentLocalCell.getBoundingClientRect().top;

          // 吸附到的坐标
          let adsorbLocation = [];
          for (let item of boardLocationMap) {
            let curMinus = Math.abs(offsetX - item[1][0]) + (Math.abs(offsetY - item[1][1]));
            if (!minus[0] || curMinus < minus[0]) {
              minus[0] = curMinus;
              minus[1] = item[1][0];
              minus[2] = item[1][1];
              adsorbLocation = item[0];
            }
          }

          // 判断拼块全路径是否合法
          if (canPuzzleIn(currentPuzzle, adsorbLocation)) {
            puzzle[i].style.left = minus[1] + 'px';
            puzzle[i].style.top = minus[2] + 'px';
          } else {
            // 清楚move效果
            puzzle[i].style.left = '';
            puzzle[i].style.top = '';
          }

          // 清除事件的绑定
          document.body.onmousemove = null;
          document.body.onmouseup = null;
          document.onkeydown = null;
          current.style.transform = '';
        });
      }
    }
  }
}

createBoard();

createSegment(puzzleMap['puzzle-1'], 'puzzle-1');
createSegment(puzzleMap['puzzle-2'], 'puzzle-2');
createSegment(puzzleMap['puzzle-3'], 'puzzle-3');
createSegment(puzzleMap['puzzle-4'], 'puzzle-4');
createSegment(puzzleMap['puzzle-5'], 'puzzle-5');
createSegment(puzzleMap['puzzle-6'], 'puzzle-6');
createSegment(puzzleMap['puzzle-7'], 'puzzle-7');
createSegment(puzzleMap['puzzle-8'], 'puzzle-8');

initPuzzle();

function breakBoard() {
  const breakBtn = document.getElementsByClassName('break')[0];
  const locations = ['X', 'Y', 'Z'];
  breakBtn.onclick = () => {
    const cells = document.getElementsByClassName('cell');
    for (let i = 0; i < cells.length; i ++) {
      let translateL = locations[parseInt(Math.random() * 10 % 3)];
      let rotateL = locations[parseInt(Math.random() * 10 % 3)];
      cells[i].style.transform = `translate${translateL}(${Math.random() * 1000}px) rotate${rotateL}(${Math.random() * 10000}deg)`;
      cells[i].style.transition = '0.8s';
    }
  }
}

function resetBoard() {
  const resetBtn = document.getElementsByClassName('reset')[0];
  resetBtn.onclick = () => {
    const cells = document.getElementsByClassName('cell');
    for (let i = 0; i < cells.length; i ++) {
      cells[i].style.transform = `translate(0px) rotate(0deg)`;
    }
  }
}

breakBoard();
resetBoard();