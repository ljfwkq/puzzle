//创建画布对象
var drawing = document.getElementById('puzzle');
//获取上下文渲染
if(drawing.getContext){
	var context = drawing.getContext('2d');
}

//绘图
var boardSize = document.getElementById('puzzle').width;//获取画布宽度
var tileCount = document.getElementById('scale').value;//根据难度获取图片分值
var tileSize = boardSize / tileCount;//计算每小块图片宽度

var img = new Image();
img.src = 'love.jpg';
img.width = boardSize;
img.height = boardSize;
img.addEventListener('load', drawTiles, false);//为图片添加事件



var clickLoc = new Object;
clickLoc.x = 0;
clickLoc.y = 0;

var emptyLoc = new Object;
emptyLoc.x = 0;
emptyLoc.y = 0;

var solved = false;

var boardParts = new Object;
setBoard();

document.getElementById('scale').onchange = function() {
  tileCount = this.value;
  tileSize = boardSize / tileCount;
  setBoard();
  drawTiles();
};

document.getElementById('puzzle').onmousemove = function(e) {
  clickLoc.x = Math.floor((e.pageX - this.offsetLeft) / tileSize);
  clickLoc.y = Math.floor((e.pageY - this.offsetTop) / tileSize);
};

document.getElementById('puzzle').onclick = function() {
  if (distance(clickLoc.x, clickLoc.y, emptyLoc.x, emptyLoc.y) == 1) {//点击的块和空的块相邻
    slideTile(emptyLoc, clickLoc);
    drawTiles();
  }
  if (solved) {
    setTimeout(function() {alert("恭喜你，拼图成功!");}, 500);
  }
};

function setBoard() {
  boardParts = new Array(tileCount);
  for (var i = 0; i < tileCount; i++) {
    boardParts[i] = new Array(tileCount);
    for (var j = 0; j < tileCount; j++) {
      boardParts[i][j] = new Object;
      boardParts[i][j].x = (tileCount - 1) - i;
      boardParts[i][j].y = (tileCount - 1) - j;
    }
  }
  
  //在困难值改变后，重置值
  emptyLoc.x = boardParts[tileCount - 1][tileCount - 1].x;
  emptyLoc.y = boardParts[tileCount - 1][tileCount - 1].y;
  solved = false;
}

function drawTiles() {
  context.clearRect ( 0 , 0 , boardSize , boardSize );//清除画布上的矩形区域
  for (var i = 0; i < tileCount; i++) {
    for (var j = 0; j < tileCount; j++) {
      var x = boardParts[i][j].x;
      var y = boardParts[i][j].y;
      if(i != emptyLoc.x || j != emptyLoc.y || solved == true) {//以对角的形式将图片画到画布上
        context.drawImage(img, x * tileSize, y * tileSize, tileSize, tileSize,
            i * tileSize, j * tileSize, tileSize, tileSize);
      }
    }
  }
}

function distance(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function slideTile(toLoc, fromLoc) {
  if (!solved) {//没有拼图成功的话
    boardParts[toLoc.x][toLoc.y].x = boardParts[fromLoc.x][fromLoc.y].x;
    boardParts[toLoc.x][toLoc.y].y = boardParts[fromLoc.x][fromLoc.y].y;
    boardParts[fromLoc.x][fromLoc.y].x = tileCount - 1;
    boardParts[fromLoc.x][fromLoc.y].y = tileCount - 1;
    toLoc.x = fromLoc.x;
    toLoc.y = fromLoc.y;
    checkSolved();
  }
}

function checkSolved() {
  var flag = true;
  for (var i = 0; i < tileCount; i++) {
    for (var j = 0; j < tileCount; j++) {
      if (boardParts[i][j].x != i || boardParts[i][j].y != j) {
        flag = false;
      }
    }
  }
  solved = flag;
}
