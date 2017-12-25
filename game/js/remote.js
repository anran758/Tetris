/**
 * 对方游戏的构建函数
 * @constructor
 * @param {*} socket
 */
var Remote = function(socket) {
  var game;

  // 获取DOM ID
  var $ = function(id) {
    return document.getElementById(id);
  };
  /**
   * 绑定按钮事件
   *
   */
  var bindEvents = function() {
    socket.on("init", function(data) {
      start(data.type, data.dir);
    });
    socket.on("next", function(data) {
      game.performNext(data.type, data.dir);
    });
    socket.on("rotate", function(data) {
      game.rotate();
    });
    socket.on("left", function(data) {
      game.left();
    });
    socket.on("right", function(data) {
      game.right();
    });
    socket.on("down", function(data) {
      game.down();
    });
    socket.on("fall", function(data) {
      game.fall();
    });
    socket.on("fixed", function(data) {
      game.fixed();
    });
    socket.on("time", function(data) {
      game.setTime(data);
    });
    socket.on("lose", function(data) {
      game.gameOver(false);
    });
    socket.on("line", function(data) {
      game.checkClear();
      game.addScore(data);
    });
    socket.on("addTailLines", function(data) {
      game.addTailLines(data);
    });
  };

  var start = function(type, dir) {
    var doms = {
      gameDiv: $("remote_game"),
      nextDiv: $("remote_next"),
      timeDiv: $("remote_time"),
      scoreDiv: $("remote_score"),
      resultDiv: $("remote_gameover")
    };

    game = new Game();
    game.init(doms, type, dir);
  };

  bindEvents();
};
