// DDM2008
// Activity 1b – Ryoji Ikeda
// Janis Lim Hui
// Keys: S = save, I = invert, SPACE = strobe toggle
// MouseX = density, MouseY = variation

let invert = false;
let cols = 160;
let colW;
let hueBase = 0;

function setup() {
  createCanvas(800, 800);
  colorMode(HSB, 360, 100, 100, 100);
  frameRate(60);
  noStroke();
  colW = width / cols;
}

function draw() {
  // translucent background for trailing effect
  if (!invert) fill(0, 0, 100, 10);
  else fill(0, 0, 0, 10);
  rect(0, 0, width, height);

  // mouse controls colour + saturation dynamics
  let hueSpeed = map(mouseX, 0, width, 0.2, 3);
  let sat = map(mouseY, 0, height, 30, 100);
  hueBase = (hueBase + hueSpeed) % 360;

  // split screen like original Ikeda piece
  drawBand(0, height / 2, sat, 0.015, 1);
  drawBand(height / 2, height / 2, sat, 0.021, -1);
}

function drawBand(y0, h, sat, nSpeed, dir) {
  for (let c = 0; c < cols; c++) {
    if (random() < 0.3) {
      const x = c * colW;
      const n = noise(c * 0.08, frameCount * nSpeed * dir);
      const hh = h * n;

      // rainbow hue shifts with column and time
      let hueVal = (hueBase + c * 2 + frameCount * 0.1) % 360;
      let bri = map(n, 0, 1, 40, 100);
      if (invert) bri = 100 - bri;

      fill(hueVal, sat, bri, 90);
      rect(x, y0, colW, hh);
    }
  }
}

function keyPressed() {
  if (key === 'S' || key === 's') saveCanvas('activity1b-colorful', 'jpg');
  if (key === 'I' || key === 'i') invert = !invert;
}