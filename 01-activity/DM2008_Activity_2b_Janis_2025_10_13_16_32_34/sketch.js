// DDM2008
// Activity 2b – Pattern Making
// Janis Lim Hui

let mode = 1;            // 1..3: rule for tiles
let cell = 40;           // base cell size (grid)
let t = 0;               // time for gentle motion
let palette;

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  palette = [
    color(210, 10, 18),   // background grey-blue
    color(210, 12, 32),
    color(0, 0, 98),      // white
    color(24, 85, 95),    // orange
    color(200, 85, 90)    // cyan
  ];
}

function draw() {
  background(palette[0]);
  t += 0.01;

  // mouse controls: horizontal = scale, vertical = density
  let scaleAmt = map(mouseX, 0, width, 0.8, 1.6);
  let density  = int(map(mouseY, 0, height, 6, 12));   // how many columns/rows
  let step = (cell * scaleAmt) * (10 / density);

  // grid
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      drawTile(x, y, step, step);
    }
  }
}

function drawTile(x, y, w, h) {
  // checkerboard alternation using modulo
  let cx = int(x / w);
  let cy = int(y / h);
  let alt = (cx + cy) % 2 === 0;

  // soft jitter so the pattern breathes
  let n = noise(cx * 0.12, cy * 0.12, t);
  let inset = map(n, 0, 1, 2, w * 0.25);

  // choose a rule by mode
  if (mode === 1) {
    // MODE 1: Alternating stripes (vertical vs horizontal)
    fill(alt ? palette[3] : palette[4]);
    rect(x, y, w, h);
    fill(0, 0, 98, 100);
    if (alt) {
      // vertical bars
      for (let i = inset; i < w - inset; i += w / 6) rect(x + i, y + inset, 3, h - inset * 2);
    } else {
      // horizontal bars
      for (let j = inset; j < h - inset; j += h / 6) rect(x + inset, y + j, w - inset * 2, 3);
    }

  } else if (mode === 2) {
    // MODE 2: Circles vs squares with size alternation
    fill(alt ? palette[2] : palette[1]);
    rect(x, y, w, h);
    let s = map(n, 0, 1, w * 0.2, w * 0.8);
    fill(alt ? palette[4] : palette[3]);
    if (alt) {
      circle(x + w / 2, y + h / 2, s);
    } else {
      rect(x + (w - s) / 2, y + (h - s) / 2, s, s, 6);
    }

  } else if (mode === 3) {
    // MODE 3: Step blocks (Ikeda-esque)
    fill(palette[1]);
    rect(x, y, w, h);
    let cols = 6;
    let barW = (w - inset * 2) / cols;
    for (let i = 0; i < cols; i++) {
      let hh = map(noise(i * 0.35, cx * 0.2, cy * 0.2, t * 1.2), 0, 1, h * 0.15, h - inset * 2);
      fill((i % 2 === 0) ? palette[2] : palette[4]);
      rect(x + inset + i * barW, y + h - inset - hh, barW * 0.8, hh);
    }
  }
}

// --- Interaction ---
function keyPressed() {
  if (key === '1') mode = 1;            // stripes
  if (key === '2') mode = 2;            // circles/squares
  if (key === '3') mode = 3;            // step blocks
  if (key === 's' || key === 'S') saveCanvas('activity2b-pattern', 'png');
}
