var canvas = document.querySelector("#canvas");
var context = canvas.getContext("2d");
var bool = true;
//棋盘数组
var chessXY = [];
//赢法数组
var wins = [];
var over = false;
for (var i = 0; i <= 15; i++) {
    chessXY[i] = [];
    wins [i] = [];
    for (var j = 0; j <= 15; j++) {
        chessXY[i][j] = 0;
        wins[i][j] = [];
    }
}

var count = 0;
//横向赢法
for (var i = 0; i <= 15; i++) {
    for (var j = 0; j <= 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i][j + k][count] = true;
        }
        count++
    }
}
//竖向赢法
for (var i = 0; i <= 15; i++) {
    for (var j = 0; j <= 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[j + k][i][count] = true;
        }
        count++
    }
}
//斜线赢法
for (var i = 0; i <= 11; i++) {
    for (var j = 0; j <= 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j + k][count] = true;
        }
        count++
    }
}
//反斜线赢法
for (var i = 0; i <= 11; i++) {
    for (var j = 15; j > 3; j--) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j - k][count] = true;
        }
        count++;
    }
}
console.log(count);
//判定赢法的数组
//我方赢法
var myWin = [];
//电脑赢法
var computerWin = [];
for (var i = 0; i < count; i++) {
    myWin[i] = 0;
    computerWin[i] = 0;
}


var img = new Image;
img.src = "./img/star.png";
img.onload = function () {
    context.drawImage(img, 0, 0, 500, 500);
    drawCheckerboard();
};
canvas.onclick = function (event) {
    if (over) {
        return
    }
    if (!bool) {
        return
    }
    event = event || window.event;
    var x = Math.floor(event.offsetX / 30);
    var y = Math.floor(event.offsetY / 30);
    if (x >= 15) {
        x = 15
    }
    if (y >= 15) {
        y = 15
    }
    var istrue =drawChesspieces(x, y, bool);
    if (istrue) {
     for (var i = 0; i < count; i++) {
        if (wins[x][y][i]) {
            myWin[i]++;
            computerWin[i] = 7;
            if (myWin[i] == 5) {
                alert("你赢了");
                over = true;
            }
        }
    }
    }
    if (!over) {
        bool = !bool;
        computerAI();
    }
};
//绘制棋盘
var drawCheckerboard = function () {
    for (var i = 0; i <= 15; i++) {
        context.moveTo(i * 30 + 25, 25);
        context.lineTo(i * 30 + 25, 475);
        context.moveTo(25, i * 30 + 25);
        context.lineTo(475, i * 30 + 25);
        context.strokeStyle = "#bfbfbf";
        context.stroke();
    }
    context.closePath();
};
// 绘制棋子
var drawChesspieces = function (x, y, am) {
    context.beginPath();
    context.arc(x * 30 + 25, y * 30 + 25, 13, 0, 2 * Math.PI, false);
    var gradient = context.createRadialGradient(x * 30 + 25 + 2, y * 30 + 25 - 2, 13, x * 30 + 25 + 2, y * 30 + 25 - 2, 0);
    if (chessXY[x][y] === 0) {
        if (am) {
            gradient.addColorStop(0, "#0A0A0A");
            gradient.addColorStop(1, "#636766");
            chessXY[x][y] = 1;
        } else {
            gradient.addColorStop(0, "#D1D1D1");
            gradient.addColorStop(1, "#F9F9F9");
            chessXY[x][y] = 2;
        }

    context.fillStyle = gradient;
    context.fill();
    context.beginPath();  
    return true;
    }else{
        return false
    }
};
//计算机Air
function computerAI() {
    var myScore = [];
    var computerScore = [];
    var max = 0;
    var x= 0,y=0;
    for (var i = 0; i <= 15; i++) {
        myScore[i] = [];
        computerScore[i] = [];
        for (var j = 0; j <= 15; j++) {
            myScore[i][j] = 0;
            computerScore[i][j] = 0
        }
    }
//    判断落子意义
    for (var i = 0; i <= 15; i++) {
        for (var j = 0; j < 15; j++) {
            if (chessXY[i][j] == 0) {
                for (var k = 0; k < count; k++) {
                    if (wins[i][j][k]) {
                        if (myWin[k] == 1) {
                            myScore[i][j] += 200
                        } else if (myWin[k] == 2) {
                            myScore[i][j] += 400
                        } else if (myWin[k] == 3) {
                            myScore[i][j] += 2000
                        } else if (myWin[k] == 4) {
                            myScore[i][j] += 8000
                        }
                        if (computerWin[k] == 1) {
                            computerScore[i][j] += 220
                        } else if (computerWin[k] == 2) {
                            computerScore[i][j] += 420
                        } else if (computerWin[k] == 3) {
                            computerScore[i][j] += 2200
                        } else if (computerWin[k] == 4) {
                            computerScore[i][j] += 19000
                        }
                    }
                }
                if (myScore[i][j] > max) {
                    max = myScore[i][j];
                    x=i;
                    y=j;
                } else if (myScore[i][j]  == max) {
                    if (computerScore[i][j]>computerScore[x][y]) {
                        x=i;
                        y=j;

                    }
                }
                if (computerScore[i][j] > max) {
                    max = computerScore[i][j];
                    x=i;
                    y=j;
                } else if (computerScore[i][j]  == max) {
                    if (myScore[i][j]>myScore[x][y]) {
                        x=i;
                        y=j;
                    }
                }
            }
        }
    }
    drawChesspieces(x,y,false);
    chessXY[x][y] = 2;
    for (var i = 0; i < count; i++) {
        if (wins[x][y][i]) {
            computerWin[i]++;
            myWin[i] = 7;
            if (computerWin[i] == 5) {
                alert("电脑赢了");
                over = true;
            }
        }
    }
    if (!over) {
        bool = !bool;
    }
}
