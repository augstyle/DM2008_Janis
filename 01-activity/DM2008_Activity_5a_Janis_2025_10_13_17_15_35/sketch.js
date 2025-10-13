// DDM2008
// Activity 5a – Colliding Circles (smooth walls)
// Janis Lim Hui

let balls = [];
const NUM_BALLS = 12;

function setup() {
  createCanvas(600, 400);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();

  for (let i = 0; i < NUM_BALLS; i++) {
    balls.push(new Ball(random(width), random(height)));
  }
}

function draw() {
  background(220, 10, 95);

  // update + edges first
  for (let b of balls) {
    b.move();
    b.bounceWalls();   // stable wall bounce with position correction
  }

  // handle collisions (pairwise)
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      resolveCollision(balls[i], balls[j]);  // smooth circle–circle
    }
  }

  // draw
  for (let b of balls) b.show();
}

// ---------------- Ball ----------------
class Ball {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(1, 2));
    this.r = random(15, 35);
    this.h = random(360);
    this.restitution = 0.96;      // a little bouncy but damped
    this.minSpeed = 0.35;         // avoid jittery stops at edges
  }

  move() {
    this.pos.add(this.vel);
    // mild global damping to keep energy sane
    this.vel.mult(0.999);
  }

  bounceWalls() {
    // LEFT
    if (this.pos.x - this.r < 0) {
      this.pos.x = this.r;
      this.vel.x = abs(this.vel.x) * this.restitution;
    }
    // RIGHT
    if (this.pos.x + this.r > width) {
      this.pos.x = width - this.r;
      this.vel.x = -abs(this.vel.x) * this.restitution;
    }
    // TOP
    if (this.pos.y - this.r < 0) {
      this.pos.y = this.r;
      this.vel.y = abs(this.vel.y) * this.restitution;
    }
    // BOTTOM
    if (this.pos.y + this.r > height) {
      this.pos.y = height - this.r;
      this.vel.y = -abs(this.vel.y) * this.restitution;
    }

    // prevent getting “stuck” with near-zero speed
    if (this.vel.mag() < this.minSpeed) {
      this.vel.setMag(this.minSpeed);
    }
  }

  show() {
    fill(this.h, 80, 90, 90);
    circle(this.pos.x, this.pos.y, this.r * 2);
  }
}

/* -------- smooth circle–circle collision ----------
   Elastic-ish resolution along the normal, with positional
   correction so circles don't remain overlapped.
---------------------------------------------------*/
function resolveCollision(a, b) {
  const n = p5.Vector.sub(b.pos, a.pos);
  const distAB = n.mag();
  const minDist = a.r + b.r;

  if (distAB === 0) return; // same position – skip

  if (distAB < minDist) {
    // --- positional correction (separate them) ---
    const overlap = (minDist - distAB);
    const percent = 0.8;       // how strongly to correct
    const slop = 0.01;         // small allowance
    const corrMag = max(overlap - slop, 0) * percent / 2; // equal masses
    const nHat = n.copy().div(distAB);

    a.pos.add(p5.Vector.mult(nHat, -corrMag));
    b.pos.add(p5.Vector.mult(nHat,  corrMag));

    // --- velocity resolution along collision normal ---
    const rv = p5.Vector.sub(b.vel, a.vel);      // relative velocity
    const velAlongNormal = rv.dot(nHat);
    if (velAlongNormal > 0) return;              // already separating

    const e = 0.92; // restitution for ball–ball
    const j = -(1 + e) * velAlongNormal / 2;     // equal mass (0.5 each)
    const impulse = p5.Vector.mult(nHat, j);

    a.vel.sub(impulse);
    b.vel.add(impulse);

    // visual feedback: tiny hue nudge
    a.h = (a.h + 6) % 360;
    b.h = (b.h + 6) % 360;
  }
}
