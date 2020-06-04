// 这是我们的玩家要躲避的敌人
var Enemy = function (x, y) {
  // 要应用到每个敌人的实例的变量写在这里
  // 我们已经提供了一个来帮助你实现更多

  // 敌人的图片，用一个我们提供的工具函数来轻松的加载文件
  this.sprite = 'images/enemy-bug.png';
  //敌人的横向坐标 -jooe
  this.x = x;
  //敌人的纵向坐标 -jooe
  this.y = y * 83 + 62;
  //敌人的随机速度 -jooe
  this.speed = 100 + Math.random() * 250;
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function (dt) {
  // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
  // 都是以同样的速度运行的
  //敌人横向运动，并在走到头以后，重新从开头继续走 -jooe
  if (this.x > 605) {
    this.x = -85;
    this.x += dt * this.speed;
  } else {
    this.x += dt * this.speed;
  }
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
var Player = function (x, y) {
  this.sprite = 'images/char-boy.png';
  //自己的横向坐标 -jooe
  this.x = x;
  //自己的纵向坐标 -jooe
  this.y = y;
};

Player.prototype.update = function () {
  //碰撞判断 -jooe
  //用for-of循环数组
  for (let allEnemie of allEnemies) {
    //判断自己和敌人x坐标的重合度
    if (Math.abs(this.x - allEnemie.x) < 78) {
      //判断自己和敌人y坐标的重合度
      if (Math.abs(this.y - allEnemie.y) < 42.5) {
        //x，y全部重合，执行下面的条件
        alert(`被虫子撞到了，重新开始吧！`);
        this.x = 101 * 2;
        this.y = 83 * 4 + 70;
      }
    }
  }
};

Player.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function (keyup) {
  //根据按键来判断人物怎么移动 -jooe
  switch (keyup) {
    //左右移动可以横穿，和敌人一样
    //上下移动出不去框架
    case 'left':
      if (this.x > 0) {
        this.x -= 101;
      } else {
        this.x = 101 * 4;
      }
      break;
    case 'up':
      if (this.y > 0) {
        this.y -= 83;
        if (this.y < 70) {
          alert(`恭喜您，顺利通过了虫子大军！！！`);
        }
        console.log(this.y);
      } else {
        alert(`你都已经胜利！！！ 还往上面跑干嘛，直接下去重新来吧！！！`);
        this.y = 83 * 4 + 70;
      }
      break;
    case 'right':
      if (this.x < 101 * 4) {
        this.x += 101;
      } else {
        this.x = 0;
      }
      break;
    case 'down':
      if (this.y <= 3 * 83 + 70) {
        this.y += 83;
      } else {
        alert(`哟哟哟，你还想下去啊！！！告诉你吧，不可能的！！！`);
      }
      break;
  }
};

// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面
var enemy = new Enemy(1, 0);
var enemy1 = new Enemy(200, 1);
var enemy2 = new Enemy(50, 2);
var allEnemies = [enemy, enemy1, enemy2];
var player = new Player(101 * 2, 83 * 3 + 70);

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Player.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function (e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
