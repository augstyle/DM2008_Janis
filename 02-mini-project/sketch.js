let cat;
let towers = [];
let sparkles = [];
let score = 0;
let gameOver = false;

function setup() {
  createCanvas(400, 600);
  cat = new Cat();
  towers.push(new Tower());

  // Sparkles
  for (let i = 0; i < 25; i++) {
    sparkles.push(new Sparkle());
  }
}

function draw() {
  // Pastel sky background
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(135, 206, 250), color(255, 192, 203), inter); // blue to pink
    stroke(c);
    line(0, y, width, y);
  }

  // Draw sparkles
  for (let s of sparkles) {
    s.update();
    s.show();
  }

  if (!gameOver) {
    cat.update();
    cat.show();

    // Towers
    if (frameCount % 90 === 0) towers.push(new Tower());
    for (let i = towers.length - 1; i >= 0; i--) {
      towers[i].update();
      towers[i].show();

      if (towers[i].hits(cat)) gameOver = true;

      if (!towers[i].passed && towers[i].x + towers[i].w < cat.x) {
        score++;
        towers[i].passed = true;
      }

      if (towers[i].offscreen()) towers.splice(i, 1);
    }

    // Score
    fill(255, 100, 150);
    stroke(255);
    strokeWeight(2);
    textSize(36);
    textAlign(CENTER, TOP);
    text(score, width / 2, 10);
    noStroke();
  } else {
    fill(255, 100, 150);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2);
    textSize(24);
    text("Press SPACE to restart", width / 2, height / 2 + 50);
  }
}

function keyPressed() {
  if (key === ' ') {
    if (!gameOver) cat.up();
    else resetGame();
  }
}

// Cat class
class Cat {
  constructor() {
    this.x = 80;
    this.y = height / 2;
    this.r = 25;
    this.gravity = 0.5;
    this.lift = -10;
    this.velocity = 0;
    this.tailOffset = 0;
    this.tailDir = 1;
  }

  show() {
    // Tail wagging
    this.tailOffset += this.tailDir * 0.3;
    if (this.tailOffset > 5 || this.tailOffset < -5) this.tailDir *= -1;

    // Body
    fill(255, 200, 180);
    ellipse(this.x, this.y + 10, 30, 35); // body

    // Tail
    fill(255, 180, 160);
    ellipse(this.x - 20, this.y + 10 + this.tailOffset, 12, 6);

    // Head
    fill(255, 220, 200);
    ellipse(this.x, this.y, 35, 35);

    // Ears
    triangle(this.x - 12, this.y - 15, this.x - 5, this.y - 25, this.x, this.y - 10);
    triangle(this.x + 12, this.y - 15, this.x + 5, this.y - 25, this.x, this.y - 10);

    // Face: eyes
    fill(0);
    ellipse(this.x - 7, this.y - 2, 6, 6);
    ellipse(this.x + 7, this.y - 2, 6, 6);

    // Sparkling eyes
    fill(255);
    ellipse(this.x - 6, this.y - 3, 2, 2);
    ellipse(this.x + 8, this.y - 3, 2, 2);

    // Nose
    fill(255, 150, 150);
    triangle(this.x - 2, this.y + 3, this.x + 2, this.y + 3, this.x, this.y + 6);

    // Whiskers
    stroke(150, 100, 100);
    line(this.x - 10, this.y + 2, this.x - 20, this.y);
    line(this.x - 10, this.y + 4, this.x - 20, this.y + 5);
    line(this.x + 10, this.y + 2, this.x + 20, this.y);
    line(this.x + 10, this.y + 4, this.x + 20, this.y + 5);
    noStroke();

    // Blush
    fill(255, 150, 200, 180);
    ellipse(this.x - 8, this.y + 5, 6, 4);
    ellipse(this.x + 8, this.y + 5, 6, 4);

    // Smile
    noFill();
    stroke(0);
    strokeWeight(1.5);
    arc(this.x, this.y + 8, 12, 6, 0, PI);
    noStroke();
  }

  up() {
    this.velocity += this.lift;
  }

  update() {
    this.velocity += this.gravity;
    this.velocity *= 0.9;
    this.y += this.velocity;

    if (this.y > height) this.y = height;
    if (this.y < 0) this.y = 0;
  }
}

// Towers
class Tower {
  constructor() {
    this.spacing = 150;
    this.top = random(height / 6, (3 / 4) * height);
    this.bottom = height - (this.top + this.spacing);
    this.x = width;
    this.w = 50;
    this.speed = 3;
    this.passed = false;
    this.colorTop = color(random(200, 255), random(150, 220), random(200, 255));
    this.colorBottom = color(random(200, 255), random(150, 220), random(200, 255));
  }

  hits(cat) {
    if (cat.y < this.top || cat.y > height - this.bottom) {
      if (cat.x > this.x && cat.x < this.x + this.w) return true;
    }
    return false;
  }

  show() {
    fill(this.colorTop);
    rect(this.x, 0, this.w, this.top, 15);
    fill(this.colorBottom);
    rect(this.x, height - this.bottom, this.w, this.bottom, 15);
  }

  update() {
    this.x -= this.speed;
  }

  offscreen() {
    return this.x < -this.w;
  }
}

// Sparkles
class Sparkle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(2, 5);
    this.speed = random(0.1, 0.5);
  }

  update() {
    this.y -= this.speed;
    if (this.y < -this.size) {
      this.y = height + this.size;
      this.x = random(width);
    }
  }

  show() {
    fill(255, 255, 255, 180);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }
}

function resetGame() {
  cat = new Cat();
  towers = [];
  towers.push(new Tower());
  score = 0;
  gameOver = false;
}
