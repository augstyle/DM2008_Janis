// DDM2008
// Mini Project – Pong (Rainbow + On-Screen Instructions)
// Janis Lim Hui

/* ----------------- Globals ----------------- */
let leftPaddle, rightPaddle, ball;
let leftScore = 0, rightScore = 0;
let state = "start";                // "start" | "play" | "point" | "gameover"
const WIN_SCORE = 7;
let useAI = true;                   // toggle with 'A'

// rainbow state
let hueBase = 0;

/* ----------------- Setup & Draw ----------------- */
function setup() {
  createCanvas(640, 360);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();

  leftPaddle  = new Paddle(30, height/2 - 30, 10, 60);
  rightPaddle = new Paddle(width - 40, height/2 - 30, 10, 60);

  ball = new Ball(width/2, height/2, 8); // starts idle
}

function draw() {
  background(220, 10, 12); // dark teal

  // rainbow shift
  hueBase = (hueBase + 0.8) % 360;

  // Court + score UI
  drawCourt();
  drawScore();

  // START / POINT / GAMEOVER overlays
  if (state === "start") {
    ui("PONG", "SPACE: Start • A: Toggle AI");
    drawInstructions();
    return;
  }
  if (state === "gameover") {
    ui("GAME OVER", `${leftScore} : ${rightScore}\nR: Restart`);
    drawInstructions();
    return;
  }
  if (state === "point") {
    ui("POINT!", "SPACE: Serve");
  }

  // 1) input
  handleInput();

  // optional simple AI for right paddle
  if (useAI && state !== "start" && state !== "gameover") {
    rightPaddle.aiFollow(ball.pos.y, 6);
  }

  // 2) update world
  leftPaddle.update();
  rightPaddle.update();

  if (state === "play") {
    ball.update();
    // 3) collisions
    ball.checkWallBounce();                // top/bottom (and out-of-bounds)
    ball.checkPaddleBounce(leftPaddle);
    ball.checkPaddleBounce(rightPaddle);
  }

  // 4) draw entities
  leftPaddle.show();
  rightPaddle.show();
  ball.show();

  // persistent mini instructions
  drawInstructions();
}

/* ----------------- Input ----------------- */
function handleInput() {
  // left paddle: W/S
  if (keyIsDown(87)) leftPaddle.vy = -leftPaddle.speed;       // W
  else if (keyIsDown(83)) leftPaddle.vy = leftPaddle.speed;   // S
  else leftPaddle.vy = 0;

  // right paddle: ↑ / ↓ (only when AI off)
  if (!useAI) {
    if (keyIsDown(UP_ARROW))   rightPaddle.vy = -rightPaddle.speed;
    else if (keyIsDown(DOWN_ARROW)) rightPaddle.vy = rightPaddle.speed;
    else rightPaddle.vy = 0;
  } else {
    rightPaddle.vy = 0;
  }
}

function keyPressed() {
  if (key === ' ') {
    if (state === "start" || state === "point") {
      const dir = random([-1, 1]);
      ball.serve(dir);
      state = "play";
    }
  }
  if (key === 'A' || key === 'a') useAI = !useAI;
  if (key === 'R' || key === 'r') resetGame();
}

function keyReleased() {
  if (!useAI) rightPaddle.vy = 0;
  leftPaddle.vy  = 0;
}

/* ----------------- Classes ----------------- */
class Paddle {
  constructor(x, y, w, h) {
    this.pos = createVector(x, y);
    this.w = w; this.h = h;
    this.vy = 0;
    this.speed = 6;
    this.hueOffset = random(360);
  }

  update() {
    this.pos.y += this.vy;
    this.pos.y = constrain(this.pos.y, 0, height - this.h);
  }

  aiFollow(targetY, ease = 6) {
    const center = this.pos.y + this.h / 2;
    const dy = targetY - center;
    this.pos.y += constrain(dy, -ease, ease);
    this.pos.y = constrain(this.pos.y, 0, height - this.h);
  }

  show() {
    // rainbow paddles
    fill((hueBase + this.hueOffset) % 360, 80, 95, 100);
    rect(this.pos.x, this.pos.y, this.w, this.h, 3);
  }
}

class Ball {
  constructor(x, y, r) {
    this.pos = createVector(x, y);
    this.r = r;
    this.vel = createVector(0, 0); // idle until serve()
    this.hueOffset = random(360);
  }

  serve(dir = 1) {
    this.pos.set(width/2, height/2);
    this.vel.set(dir * random(3.2, 3.8), random([-1, 1]) * random(1.6, 2.4));
  }

  update() {
    this.pos.add(this.vel);

    // out-of-bounds → point / gameover
    if (this.pos.x + this.r < 0) {
      rightScore++; this.vel.set(0, 0);
      state = (rightScore >= WIN_SCORE) ? "gameover" : "point";
    } else if (this.pos.x - this.r > width) {
      leftScore++; this.vel.set(0, 0);
      state = (leftScore >= WIN_SCORE) ? "gameover" : "point";
    }
  }

  checkWallBounce() {
    if (this.pos.y - this.r <= 0 || this.pos.y + this.r >= height) {
      this.vel.y *= -1;
      this.pos.y = constrain(this.pos.y, this.r, height - this.r);
    }
  }

  checkPaddleBounce(p) {
    const withinY = this.pos.y > p.pos.y && this.pos.y < p.pos.y + p.h;
    const withinX = this.pos.x + this.r > p.pos.x && this.pos.x - this.r < p.pos.x + p.w;

    if (withinX && withinY) {
      const paddleCenter = p.pos.y + p.h / 2;
      const offset = (this.pos.y - paddleCenter) / (p.h / 2); // -1..1
      this.vel.x *= -1;
      this.vel.y += offset * 2.2;
      this.vel.limit(6);

      if (this.vel.x > 0) this.pos.x = p.pos.x + p.w + this.r;
      else this.pos.x = p.pos.x - this.r;
    }
  }

  show() {
    // rainbow ball with a glow ring
    const h = (hueBase + this.hueOffset) % 360;
    fill(h, 90, 100, 90);
    circle(this.pos.x, this.pos.y, this.r * 2);
    noFill(); stroke(h, 80, 100, 60); strokeWeight(2);
    circle(this.pos.x, this.pos.y, this.r * 2 + 4);
    noStroke();
  }
}

/* ----------------- UI helpers ----------------- */
function drawCourt() {
  // dashed rainbow center line
  strokeWeight(3);
  for (let y = 10, i = 0; y < height; y += 18, i++) {
    stroke((hueBase + i * 10) % 360, 80, 95, 100);
    line(width/2, y, width/2, y + 8);
  }
  noStroke();
}

function drawScore() {
  textAlign(CENTER, TOP);
  textSize(28);
  fill((hueBase + 20) % 360, 80, 95, 100);
  text(`${leftScore}`, width * 0.25, 12);
  fill((hueBase + 200) % 360, 80, 95, 100);
  text(`${rightScore}`, width * 0.75, 12);
}

function ui(title, subtitle) {
  // translucent panel
  fill(0, 0, 0, 60);
  rectMode(CENTER);
  rect(width/2, height/2, 280, 140, 10);

  // title (rainbow)
  textAlign(CENTER, CENTER);
  textSize(28);
  fill((hueBase + 90) % 360, 80, 95, 100);
  text(title, width/2, height/2 - 24);

  // subtitle
  textSize(14);
  fill(0, 0, 100, 100);
  text(subtitle, width/2, height/2 + 18);
}

function drawInstructions() {
  // small sticky instructions box (bottom-left)
  const lines = [
    "Controls:",
    "W/S – Left paddle",
    "↑/↓ – Right paddle (AI off)",
    "SPACE – Start/Serve",
    "A – Toggle AI",
    "R – Restart",
    `Win: first to ${WIN_SCORE}`
  ];
  const w = 190, h = 132;

  // panel
  rectMode(CORNER);
  fill(0, 0, 0, 55);
  rect(10, height - h - 10, w, h, 8);

  // header rainbow
  textAlign(LEFT, TOP);
  textSize(13);
  fill((hueBase + 140) % 360, 80, 95, 100);
  text(lines[0], 18, height - h - 2 + 16);

  // body
  textSize(12);
  fill(0, 0, 95, 100);
  for (let i = 1; i < lines.length; i++) {
    text(lines[i], 18, height - h - 2 + 16 + i * 16);
  }
}

function resetGame() {
  leftScore = 0; rightScore = 0;
  state = "start";
  ball.pos.set(width/2, height/2);
  ball.vel.set(0, 0);
}
