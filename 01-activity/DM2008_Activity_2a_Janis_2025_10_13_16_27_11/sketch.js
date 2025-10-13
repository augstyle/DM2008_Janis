// DDM2008
// Activity 2a – Mode Switch (amped up)
// Janis Lim Hui

let mode = 1;
let paused = false;
let bg = 0;

let t = 0;                 // global time
let hueBase = 200;         // cycles colours (HSB)

let comet = { x: 200, y: 200, vx: 0, vy: 0 };
let lissajousTrail = [];
let satellites = [];

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  bg = color(230, 5, 8, 100);

  // preload satellites for mode 4
  for (let i = 0; i < 6; i++) {
    satellites.push({
      r: 35 + i * 18,     // radius from center
      a: random(TWO_PI),  // angle
      s: random(0.01, 0.04), // angular speed
      rot: random(TWO_PI) // self-rotation
    });
  }
}

function draw() {
  if (paused) return;

  // soft trails for all modes
  fill(hue(bg), saturation(bg), brightness(bg), 10);
  rect(0, 0, width, height);

  t += 0.01;
  hueBase = (hueBase + 0.3) % 360;

  switch (mode) {
    case 1: drawMode1(); break;
    case 2: drawMode2(); break;
    case 3: drawMode3(); break;
    case 4: drawMode4(); break;
  }
}

/* ----------------- MODE 1: COMET (noise-steered) -----------------
   MouseX = speed, MouseY = tail length (persistence)
-------------------------------------------------------------------*/
function drawMode1() {
  let spd = map(mouseX, 0, width, 0.5, 3);
  let tailA = map(mouseY, 0, height, 6, 30);
  fill(hue(bg), saturation(bg), brightness(bg), tailA);
  rect(0, 0, width, height); // extra fade to control tail

  // Perlin-noise steering
  let ang = noise(t * 2, comet.x * 0.01, comet.y * 0.01) * TAU;
  comet.vx = cos(ang) * spd;
  comet.vy = sin(ang) * spd;
  comet.x = (comet.x + comet.vx + width) % width;
  comet.y = (comet.y + comet.vy + height) % height;

  // glow halo
  push();
  translate(comet.x, comet.y);
  blendMode(ADD);
  for (let i = 8; i >= 1; i--) {
    fill((hueBase + i * 6) % 360, 80, map(i, 1, 8, 100, 20), 60);
    circle(0, 0, i * 7);
  }
  blendMode(BLEND);
  pop();
}

/* ----------------- MODE 2: METABALLS / ADDITIVE ORBS --------------
   MouseX = number of orbs, MouseY = size
-------------------------------------------------------------------*/
function drawMode2() {
  let n = int(map(mouseX, 0, width, 3, 15));
  let sz = map(mouseY, 0, height, 10, 40);
  blendMode(ADD);
  for (let i = 0; i < n; i++) {
    let px = width * (0.5 + 0.4 * sin(t * (1.2 + i * 0.07) + i));
    let py = height * (0.5 + 0.4 * cos(t * (0.9 + i * 0.05) - i));
    fill((hueBase + i * 20) % 360, 90, 95, 50);
    circle(px, py, sz + 10 * sin(t * 3 + i));
  }
  blendMode(BLEND);
}

/* --------------- MODE 3: LISSAJOUS FLOWER (your fave) ------------
   MouseX = pattern complexity, MouseY = petal count (frequency)
-------------------------------------------------------------------*/
function drawMode3() {
  let ax = int(map(mouseX, 0, width, 2, 7)); // frequency X
  let ay = int(map(mouseY, 0, height, 2, 9)); // frequency Y

  // point on Lissajous curve
  let px = width / 2 + 120 * sin(t * ax);
  let py = height / 2 + 120 * sin(t * ay + PI / 2);

  // keep short trail
  lissajousTrail.push(createVector(px, py));
  if (lissajousTrail.length > 140) lissajousTrail.shift();

  // draw trail as multi-colour ribbon
  noFill();
  beginShape();
  for (let i = 0; i < lissajousTrail.length; i++) {
    let p = lissajousTrail[i];
    stroke((hueBase + i) % 360, 80, map(i, 0, lissajousTrail.length, 40, 100), 80);
    strokeWeight(map(i, 0, lissajousTrail.length, 1, 4));
    vertex(p.x, p.y);
  }
  endShape();

  // head bloom
  noStroke();
  for (let r = 12; r >= 1; r--) {
    fill((hueBase + r * 8) % 360, 90, 100, 70);
    circle(px, py, r * 2);
  }
}

/* --------------- MODE 4: ORBITAL SQUARE CONSTELLATION ------------
   MouseX = overall rotation speed, MouseY = square size
-------------------------------------------------------------------*/
function drawMode4() {
  let speed = map(mouseX, 0, width, 0.002, 0.03);
  let s = map(mouseY, 0, height, 8, 28);

  push();
  translate(width / 2, height / 2);

  // central core
  push();
  rotate(frameCount * 0.01);
  fill((hueBase + 180) % 360, 70, 95, 90);
  rectMode(CENTER);
  rect(0, 0, 26, 26, 4);
  pop();

  // satellites
  for (let i = 0; i < satellites.length; i++) {
    let sat = satellites[i];
    sat.a += sat.s + speed;
    sat.rot += 0.03;

    let rx = cos(sat.a) * sat.r;
    let ry = sin(sat.a) * sat.r;
    push();
    translate(rx, ry);
    rotate(sat.rot);
    fill((hueBase + i * 30) % 360, 80, 100, 80);
    rectMode(CENTER);
    rect(0, 0, s, s, 6);
    pop();
  }
  pop();
}

/* --------------------------- CONTROLS ----------------------------*/
function keyPressed() {
  if (key === ' ') { paused = !paused; return; }
  if (key === '1') { mode = 1; bg = color(225, 5, 8, 100); }
  if (key === '2') { mode = 2; bg = color(0, 0, 5, 100); }      // dark for glow
  if (key === '3') { mode = 3; bg = color(230, 6, 10, 100); }
  if (key === '4') { mode = 4; bg = color(210, 8, 12, 100); }
}
