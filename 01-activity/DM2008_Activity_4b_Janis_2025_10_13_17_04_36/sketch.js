// DDM2008
// Activity 4b – Objects in Motion
// Janis Lim Hui

let agents = [];
const START_COUNT = 60;

let useBounce = false;
let attractToMouse = false;
let jitterOn = true;

function setup() {
  createCanvas(600, 400);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  for (let i = 0; i < START_COUNT; i++) addAgent(random(width), random(height));
}

function draw() {
  background(200, 10, 96);

  for (let a of agents) {
    if (attractToMouse) a.steer(createVector(mouseX, mouseY), 0.08);
    if (jitterOn) a.jitter(0.25);
    if (useBounce) a.bounce(); else a.wrap();
    a.update();
    a.show();
  }

  // remove dead ones
  for (let i = agents.length - 1; i >= 0; i--) {
    if (agents[i].dead) agents.splice(i, 1);
  }

  hud();
}

class Agent {
  constructor(x, y, r = 10) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.5, 2.2));
    this.acc = createVector(0, 0);
    this.r = r;
    this.h = random(360);
    this.alpha = 85;
    this.spin = random(-0.03, 0.03);
    this.dead = false;
  }

  update() {
    this.vel.add(this.acc).limit(4);
    this.pos.add(this.vel);
    this.acc.mult(0);

    this.h = (this.h + 0.6) % 360;
    this.alpha = max(0, this.alpha - 0.02);
    this.r = max(2, this.r - 0.005);

    if (this.alpha <= 0.1 || this.r <= 2) this.dead = true;
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(frameCount * this.spin);
    for (let i = 6; i >= 1; i--) {
      fill(this.h, 70, map(i, 1, 6, 100, 60), this.alpha * map(i, 1, 6, 20, 6));
      circle(0, 0, this.r * i * 0.6);
    }
    fill((this.h + 180) % 360, 80, 95, this.alpha + 10);
    circle(0, 0, this.r * 0.9);
    pop();
  }

  applyForce(f) { this.acc.add(f); }

  steer(target, strength = 0.05) {
    const desired = p5.Vector.sub(target, this.pos).setMag(2.5);
    const steer = p5.Vector.sub(desired, this.vel).limit(0.8);
    this.applyForce(steer.mult(strength));
  }

  jitter(mag = 0.2) {
    this.applyForce(createVector(random(-mag, mag), random(-mag, mag)));
  }

  wrap() {
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }

  bounce() {
    if (this.pos.x < 0 || this.pos.x > width) {
      this.vel.x *= -1;
      this.pos.x = constrain(this.pos.x, 0, width);
    }
    if (this.pos.y < 0 || this.pos.y > height) {
      this.vel.y *= -1;
      this.pos.y = constrain(this.pos.y, 0, height);
    }
  }
}

// ---- helpers ----
function addAgent(x, y) {
  agents.push(new Agent(x, y, random(8, 20)));
}

function mousePressed() {
  for (let i = 0; i < 6; i++) addAgent(mouseX + random(-6, 6), mouseY + random(-6, 6));
}

function keyPressed() {
  if (key === 'B' || key === 'b') useBounce = !useBounce;
  if (key === 'M' || key === 'm') attractToMouse = !attractToMouse;
  if (key === 'J' || key === 'j') jitterOn = !jitterOn;
  if (key === 'R' || key === 'r') for (let a of agents) a.vel.rotate(random(-PI, PI));
  if (key === 'C' || key === 'c') agents = [];
  if (key === 'A' || key === 'a') for (let i = 0; i < 40; i++) addAgent(random(width), random(height));
}

function hud() {
  push();
  noStroke();
  fill(0, 60);
  rect(10, 10, 270, 80, 8);
  fill(0, 0, 100);
  textSize(12);
  textLeading(16);
  text(
    `agents: ${agents.length}
[B] bounce:${useBounce ? 'on' : 'off'}  [M] attract:${attractToMouse ? 'on' : 'off'}  [J] jitter:${jitterOn ? 'on' : 'off'}
click: add burst  |  [A] add many  [C] clear`,
    20, 30
  );
  pop();
}
