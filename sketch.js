let spriteStop, spriteWalk, spriteJump, spriteAttack;
let x, y;
let direction = 1; // 1: 右, -1: 左
let isMoving = false;
let isJumping = false;
let isAttacking = false;
let velocityY = 0;
let attackFrameCounter = 0;
const jumpForce = -15; // 向上跳躍的初始力量 (負數代表向上)
const gravity = 0.6;   // 重力加速度
let groundY;

// 站立動畫的設定
const stopSpriteWidth = 204 / 4; // 51
const stopSpriteHeight = 72;
const stopNumFrames = 4;

// 走路動畫的設定
const walkSpriteWidth = 373 / 6; // ~62.16
const walkSpriteHeight = 73;
const walkNumFrames = 6;

// 跳躍動畫的設定
const jumpSpriteWidth = 165 / 3; // 55
const jumpSpriteHeight = 74;
const jumpNumFrames = 3;

// 大圈攻擊動畫的設定
const attackSpriteWidth = 733 / 6; // ~122.16
const attackSpriteHeight = 114;
const attackNumFrames = 6;

const animationSpeed = 8; // 動畫速度，數字越小越快
const moveSpeed = 5; // 角色移動速度

function preload() {
 // 預先載入站立和走路的圖片精靈
  spriteStop = loadImage('1/Stop/All-Stop.png');
  spriteWalk = loadImage('1/Walk/All-Walk.png');
  spriteJump = loadImage('1/Jump/All-Jump.png');
  spriteAttack = loadImage('1/大圈攻擊/All-大圈攻擊.png');
}

function setup() {
  // 建立一個全視窗的畫布
  createCanvas(windowWidth, windowHeight);
   // 初始化角色位置在畫面中央
  x = width / 2;
  y = height / 2;
  groundY = y; // 將初始y位置設為地面
}

function draw() {
  // 設定背景顏色
  background('#ffe5d9');

  // --- 物理與狀態更新 ---

  // 1. 處理攻擊動畫播放
  if (isAttacking) {
    attackFrameCounter++;
    const attackAnimSpeed = 5; // 攻擊動畫專用速度，數字越小越快
    // 如果動畫播放完畢 (6個影格 * 每個影格的持續時間)
    if (attackFrameCounter >= attackNumFrames * attackAnimSpeed) {
      isAttacking = false;
    }
  }

  // 2. 處理跳躍 (不在攻擊時)
  if (keyIsDown(87) && !isJumping && !isAttacking) { // 'W' 鍵
    isJumping = true;
    velocityY = jumpForce;
  }

  if (isJumping) {
    velocityY += gravity;
    y += velocityY;

    if (y >= groundY) {
      y = groundY;
      isJumping = false;
      velocityY = 0;
    }
  }

  // 3. 處理左右移動 (不在跳躍或攻擊中才能左右移動)
  isMoving = false;
  if (!isJumping && !isAttacking) {
    if (keyIsDown(68)) { // 'D' 鍵
      isMoving = true;
      direction = 1;
      x += moveSpeed;
    } else if (keyIsDown(65)) { // 'A' 鍵
      isMoving = true;
      direction = -1;
      x -= moveSpeed;
    }
  }


  // --- 繪製角色 ---
  push(); // 保存當前的繪圖設定
  translate(x, y); // 將原點移動到角色位置
  scale(direction, 1); // 根據方向翻轉畫布

  let frame, spriteSheet, sWidth, sHeight;

  if (isAttacking) {
    spriteSheet = spriteAttack;
    sWidth = attackSpriteWidth;
    sHeight = attackSpriteHeight;
    // 根據攻擊計數器計算當前影格
    frame = floor(attackFrameCounter / 5); // 使用較快的攻擊速度
  }
  else if (isJumping) {
    spriteSheet = spriteJump;
    sWidth = jumpSpriteWidth;
    sHeight = jumpSpriteHeight;
    // 根據速度決定跳躍影格 (簡易版)
    if (velocityY < -5) frame = 0; // 上升
    else if (velocityY > 5) frame = 2; // 下降
    else frame = 1; // 頂點
  } else if (isMoving) {
    spriteSheet = spriteWalk;
    sWidth = walkSpriteWidth;
    sHeight = walkSpriteHeight;
    frame = floor(frameCount / animationSpeed) % walkNumFrames; // 走路動畫循環播放
  } else {
    spriteSheet = spriteStop;
    sWidth = stopSpriteWidth;
    sHeight = stopSpriteHeight;
    // 站立動畫來回播放 (ping-pong)
    const totalFramesInSequence = (stopNumFrames - 1) * 2;
    let sequenceFrame = floor(frameCount / animationSpeed) % totalFramesInSequence;
    frame = sequenceFrame >= stopNumFrames ? totalFramesInSequence - sequenceFrame : sequenceFrame;
  }

  // 繪製目前影格，放大兩倍，並將中心對齊 (0,0)
  let dWidth = sWidth * 2;
  let dHeight = sHeight * 2;
  image(spriteSheet, -dWidth / 2, -dHeight / 2, dWidth, dHeight, frame * sWidth, 0, sWidth, sHeight);

  pop(); // 恢復原本的繪圖設定
}

function keyPressed() {
  // 當按下空白鍵，且角色不在跳躍或攻擊狀態時，觸發攻擊
  if (keyCode === 32 && !isJumping && !isAttacking) {
    isAttacking = true;
    attackFrameCounter = 0; // 重置攻擊動畫計數器
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
