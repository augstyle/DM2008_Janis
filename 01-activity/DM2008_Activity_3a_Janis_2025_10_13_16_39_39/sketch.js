// DDM2008
// Activity 3a – Array Sampler
// Janis Lim Hui

// Each item in the array is an object (x, y, r, color, velocity)
let balls = [];
let palette = ["#f06449", "#009988", "#3c78d8", "#ffeb3b", "#7b5cff"];
let nextColor = 0;
let paused = false;
let autoAdd = false;

function setup() {
  createCanvas(400, 400);
  noStroke();
  // seed a few to start
  for (let i = 0; i < 5; i++) addBall(random(width), random(height));
}

function draw() {
  if (paused) return;
  background("#16181d");

  // --- update & draw all items in the array ---
  for (let i = 0; i < balls.length; i++) {
    let b = balls[i];

    // motion
    b.x += b.vx;
    b.y += b.vy;

    // wrap around edges
    if (b.x < -b.r) b.x = width + b.r;
    if (b.x > width + b.r) b.x = -b.r;
    if (b.y < -b.r) b.y = height + b.r;
    if (b.y > height + b.r) b.y = -b.r;

    // subtle breathing (size oscillation)
    let breathe = sin(frameCount * 0.03 + i) * 2;
    fill(b.col);
    circle(b.x, b.y, b.r + breathe);
  }

  // auto-add a ball every ~40 frames when toggled
  if (autoAdd && frameCount % 40 === 0) addBall(random(width), random(height));

  // UI hint
  fill(255, 180);
  textSize(12);
  textAlign(LEFT, TOP);
  text(
    `balls: ${balls.length}
mouse: add  •  R: remove last  •  C: clear
SPACE: pause  •  A: auto-add  •  S: save`,
    10, 10
  );
}

// ---- helpers ----
function addBall(x, y) {
  balls.push({
    x: x,
    y: y,
    r: random(14, 34),
    col: palette[nextColor++ % palette.length],
    vx: random(-1.2, 1.2),
    vy: random(-1.0, 1.0)
  });
}

// ---- interactions ----
function mousePressed() {
  addBall(mouseX, mouseY);       // add at cursor
}

function keyPressed() {
  if (key === 'R' || key === 'r') balls.pop();          // remove last
  if (key === 'C' || key === 'c') balls.splice(0);      // clear all
  if (key === ' ') paused = !paused;                    // pause / resume
  if (key === 'A' || key === 'a') autoAdd = !autoAdd;   // toggle auto-add
  if (key === 'S' || key === 's') saveCanvas('activity3a_array', 'png');
}
