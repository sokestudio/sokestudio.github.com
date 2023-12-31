var chess = document.getElementById("chess");
var context = chess.getContext("2d");
var flag = false; //判断是否有赢家以便于判断是否可以继续游玩

//棋盘上棋子情况，0：没有棋子，1有黑棋，2有白棋
var checkChess = [];
for (var i = 0; i < 15; i++) {
    checkChess[i] = [];
    for (var j = 0; j < 15; j++) {
        checkChess[i][j] = 0;
    }
}


//赢法数组###########
var wins = [];
//初始化棋盘
for (var i = 0; i < 15; i++) {
    wins[i] = [];
    for (var j = 0; j < 15; j++) {
        wins[i][j] = [];
    }
}
//赢法索引
var find = 0;
//所有横线
for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i][j + k][find] = true;
        }
        find++;
    }
}


//所有竖线
for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[j + k][i][find] = true;
        }
        find++;
    }
}


//所有斜线
for (var i = 0; i < 11; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j + k][find] = true;
        }
        find++;
    }
}


//所有反斜线
for (var i = 0; i < 11; i++) {
    for (var j = 14; j > 3; j--) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j - k][find] = true;
        }
        find++;
    }
}

//赢法统计
//等价于：如果在某种方法上得到了5分，就会结束游戏
//初始化：将每一种赢法在双方上置于0分
var user_win = [];
var con_win = [];
for (var i = 0; i < find; i++) {
    user_win[i] = 0;
    con_win[i] = 0;
}


//棋盘格子颜色
context.strokeStyle = "#bfbfbf";


//背景设置
var image = new Image();
image.src = "logo.png";
image.onload = function() {
    //drawImage参数（图片路径，图片顶点位置，图片顶点位置，宽，高）
    context.drawImage(image, 0, 0, 300, 300);
    drawChessImage();
    // drawArc(0, 0, true);
    // drawArc(1, 1, false);
}


// console.log("监听点1");
//【交互】落子
var me = true;
chess.onclick = function(e) {
    //判断是否结束游戏
    if (flag) {
        //window.alert("卧槽，你赢了");
        return;
    }
    if (!me) {
        return;
    }
    //只要在一定范围内点击都能算在最近一个交叉点落子
    var x = Math.floor(e.offsetX / 20);
    var y = Math.floor(e.offsetY / 20);
    // console.log("监听点2");
    if (checkChess[x][y] == 0) {
        drawArc(x, y, me);
        checkChess[x][y] = 1;
        //基本运行完毕后遍历棋盘给在落子涉及的赢法加分
        //因为onclick是我们落子，所以只需要给自己加分即可
        for (var k = 0; k < find; k++) {
            // console.log("监听点3");
            if (wins[x][y][k]) {
                user_win[k]++;
                con_win[k] = 999;
                if (user_win[k] == 5) {
                    window.alert("哇，你好厉害呀~");
                    flag = true;
                }
            }
        }
        if (!flag) {
            // console.log("监听点4");
            me = !me;
            conPlayAI();
        }
    }
}


//##############电脑下棋
var conPlayAI = function() {
    var userScore = [];
    var conScore = [];

    var max = 0; //保存最高落子权重
    var u = 0;
    var v = 0; //保存最高落子权重的坐标
    // console.log("监听点5");
    for (var i = 0; i < 15; i++) {
        userScore[i] = [];
        conScore[i] = [];
        for (var j = 0; j < 15; j++) {
            userScore[i][j] = 0;
            conScore[i][j] = 0;
        }
    }
    //####遍历棋盘找到可以下的点
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 15; j++) {
            //找到没有落子的点
            if (checkChess[i][j] == 0) {
                for (var k = 0; k < find; k++) {
                    //判断该点落子是否有价值
                    // console.log("监听点9");
                    if (wins[i][j][k]) {
                        //判断这个点拦截的价值
                        if (user_win[k] == 1) {
                            userScore[i][j] += 200;
                        } else if (user_win[k] == 2) {
                            userScore[i][j] += 400;
                        } else if (user_win[k] == 3) {
                            userScore[i][j] += 2000;
                        } else if (user_win[k] == 4) {
                            userScore[i][j] += 10000;
                        } else {;
                            //console.log("溢出点1");
                        }
                        //判断自己落子的权重
                        if (con_win[k] == 1) {
                            conScore[i][j] += 220;
                        } else if (con_win[k] == 2) {
                            conScore[i][j] += 440;
                        } else if (con_win[k] == 3) {
                            conScore[i][j] += 2100;
                        } else if (con_win[k] == 4) {
                            conScore[i][j] += 20000;
                        } else {;
                            //console.log("溢出点2");
                        }

                    }
                    //console.log("监听点10");
                }
                //console.log("监听点11");
                //更新最高权重
                //获取userScore和conScore最高的一个点
                if (userScore[i][j] > max) {
                    max = userScore[i][j];
                    u = i;
                    v = j;
                } else if (userScore[i][j] == max) {
                    if (conScore[i][j] > conScore[u][v]) {
                        u = i;
                        v = j;
                    }
                } else {; }
                if (conScore[i][j] > max) {
                    max = conScore[i][j];
                    u = i;
                    v = j;
                } else if (conScore[i][j] == max) {
                    if (userScore[i][j] > userScore[u][v]) {
                        u = i;
                        v = j;
                    }
                } else {; }
            }
        }
    }
    //console.log("监听点12");
    drawArc(u, v, false); //画棋盘
    checkChess[u][v] = 2; //棋盘情况更新
    for (var k = 0; k < find; k++) {
        if (wins[u][v][k]) {
            con_win[k]++;
            user_win[k] = 999;
            if (con_win[k] == 5) {
                window.alert("emm，很遗憾再试试吧~");
                flag = true;
            }
        }
    }
    if (!flag) {
        me = !me;
        //conPlayAI();
    }
}



//画圆
var drawArc = function(x, y, me) {
    context.beginPath();
    //arc参数（圆心横坐标，圆心纵坐标，半径，起始弧度，终止弧度）
    context.arc(10 + x * 20, 10 + y * 20, 8, 0, 2 * Math.PI);
    context.closePath();
    var colorChange = context.createRadialGradient(10 + x * 20, 10 + y * 20, 8, 10 + x * 20, 10 + y * 20, 0);
    if (me) {
        colorChange.addColorStop(0, "#0a0a0a");
        colorChange.addColorStop(1, "#636766");
    } else {
        colorChange.addColorStop(0, "#d1d1d1");
        colorChange.addColorStop(1, "#636766");
    }
    context.fillStyle = colorChange;
    context.fill();

}

//画棋盘
var drawChessImage = function() {
    for (var i = 0; i < 30; i++) {
        
     
        context.moveTo(10 + i * 20, 10);
        context.lineTo(10 + i * 20, 290);
        context.stroke();
        

        context.moveTo(10, 10 + i * 20);
        context.lineTo(290, 10 + i * 20);
        context.stroke();
    }
}

// //画斜线
// context.moveTo(0, 0);
// context.lineTo(450, 450);
// context.stroke();