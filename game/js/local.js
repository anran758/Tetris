/**
 * 相关事件跟DOM构建函数
 * @param {*} socket
 */
var Local = function(socket) {
  var game;
  // 事件间隔
  var INTERVAL = 200;
  // 定时器
  var timer = null;
  // 事件计时器
  var timeCount = 0;
  var time = 0;

  var $ = function(id) {
    return document.getElementById(id);
  };

  // 绑定键盘事件
  var bindkeyEvent = function() {
    document.onkeydown = function(e) {
      if (e.keyCode === 38) {
        // up
        game.rotate();
        socket.emit("rotate");
      } else if (e.keyCode === 39) {
        // right
        game.right();
        socket.emit("right");
      } else if (e.keyCode === 40) {
        // down
        game.down();
        socket.emit("down");
      } else if (e.keyCode === 37) {
        // left
        game.left();
        socket.emit("left");
      } else if (e.keyCode === 32) {
        // space
        game.fall();
        socket.emit("fall");
      }
    };
  };

  // 移动
  var move = function() {
    timeFunc();
    if (!game.down()) {
      game.fixed();
      socket.emit("fixed");
      var line = game.checkClear();
      if (line) {
        game.addScore(line);
        socket.emit("line", line);
        console.log('line', line)
        if (line > 1) {
          console.log('line', line)
          var bottomLines = generataBottomLine(line);
          socket.emit("bottomLines", bottomLines);
        }
      }
      var gameOver = game.checkGameOver();
      if (gameOver) {
        game.gameOver(false);
        $("remote_gameover").innerHTML = "你赢了";
        socket.emit("lose");
        stop();
      } else {
        var d = generateDir();
        var t = generateType();
        game.performNext(t, d);
        socket.emit("next", { type: t, dir: d });
      }
    } else {
      socket.emit("down");
    }
  };

  var generataBottomLine = function(lineNum) {
    var lines = [];
    for (var i = 0; i < lineNum; i++) {
      var line = [];
      for (var j = 0; j < 10; j++) {
        line.push(Math.ceil(Math.random() * 2) - 1);
      }
      lines.push(line);
    }
    return lines;
  };

  // 计时函数
  var timeFunc = function() {
    timeCount = timeCount + 1;
    if (timeCount === 5) {
      timeCount = 0;
      time = time + 1;
      game.setTime(time);
      socket.emit("time", time);
    }
  };

  // 随机生成一个方块种类
  var generateType = function() {
    return Math.ceil(Math.random() * 7) - 1;
  };

  // 随机生成一个旋转次数
  var generateDir = function() {
    return Math.ceil(Math.random() * 4) - 1;
  };

  // 开始
  var start = function() {
    var doms = {
      gameDiv: document.getElementById("local_game"),
      nextDiv: document.getElementById("local_next"),
      timeDiv: document.getElementById("local_time"),
      scoreDiv: document.getElementById("local_score"),
      resultDiv: document.getElementById("local_gameover")
    };

    game = new Game();

    var type = generateType();
    var dir = generateDir();
    game.init(doms, type, dir);
    socket.emit("init", { type: type, dir: dir });
    bindkeyEvent();

    var d = generateDir();
    var t = generateType();
    game.performNext(t, d);
    socket.emit("next", { type: t, dir: d });

    timer = setInterval(move, INTERVAL);
  };
  /**
   * 游戏结束
   *
   */
  var stop = function() {
    clearInterval(timer);
    timer = null;
    document.onkeydown = null;
  };

  socket.on("start", function() {
    $("waiting").innerHTML = "";
    start();
  });

  socket.on("lose", function() {
    game.gameOver(true);
    stop();
  });

  socket.on("leave", function() {
    console.log(123456);
    $("local_gameover").innerHTML = "对方掉线";
    $("remote_gameover").innerHTML = "已掉线";
    stop();
  });

  socket.on("bottomLines", function(data) {
    console.log(123)
    game.addTailLines(data);
    socket.emit("addTailLines", data);
  });
};
