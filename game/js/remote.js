var Remote = function() {
  var game;

  // 获取DOM ID
  var $ = function (id) {
    return document.getElementById(id)
  }
/**
 * 绑定按钮事件
 * 
 */
var bindEvents = function () {
    $('down').onclick = function () {
      game.down()
    }
    $('left').onclick = function () {
      game.left()
    }
    $('right').onclick = function () {
      game.right()
    }
    $('rotate').onclick = function () {
      game.rotate()
    }
    $('fixed').onclick = function () {
      game.fixed()
    }
    $('performNext').onclick = function () {
      game.performNext(2, 2)
    }
    $('checkClear').onclick = function () {
      game.checkClear()
    }
    $('setTime').onclick = function () {
      game.setTime(20)
    }
    $('addScore').onclick = function () {
      game.addScore(4)
    }
    $('gameOver').onclick = function () {
      game.gameOver(true)
    }
    $('checkGameOver').onclick = function () {
      game.checkGameOver()
    }
    $('addTailLines').onclick = function () {
      game.addTailLines([0, 1, 0, 1, 0, 1, 0, 1, 0, 1])
    }
  }
  
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

  /**
   * 导出API
   */
  this.start = start;
  this.bindEvents = bindEvents
};
