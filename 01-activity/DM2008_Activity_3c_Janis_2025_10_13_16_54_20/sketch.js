// DDM2008
// Activity 3c – Painting App
// Janis Lim Hui

// ----- palette / size -----
const palette = ["#f06449", "#009988", "#3c78d8", "#eeeeee", "#7b5cff"];
let colorIndex = 0;
let sizeVal = 24;

// ----- brush registry -----
let currentBrush = 0; // 0..2
const brushes = [brushSoftCircle, brushSquareRot, brushRibbon];

// ----- state -----
let erasing = false;
let prevX = null, prevY = null; // for ribbon brush

function setup() {
  createCanvas(600, 600);
  background(240);
  rectMode(CENTER);
  noFill();
  strokeJoin(ROUND);
  strokeCap(ROUND);
}

function draw() {
  // paint only while mouse is held
  if (mouseIsPressed) {
    const col = erasing ? color(240) : color(palette[colorIndex]);
    brushes[currentBrush](mouseX, mouseY, col, sizeVal);
  }

  // HUD
  drawHUD();
}

function mouseReleased() {
  prevX = prevY = null; // reset ribbon continuity
}

// ===== Brushes (as functions) =====

// 1) Soft round brush (builds a fuzzy stamp with translucency)
function brushSoftCircle(x, y, c, s) {
  noStroke();
  for (let i = 0; i < 10; i++) {
    const r = s * (1 - i / 10);
    c.setAlpha(map(i, 0, 9, 30, 6));
    fill(c);
    circle(x + random(-1, 1), y + random(-1, 1), r);
  }
}

// 2) Rotating square stamp (adds a bit of form)
function brushSquareRot(x, y, c, s) {
  push();
  translate(x, y);
  rotate(frameCount * 0.05);
  noStroke();
  c.setAlpha(180);
  fill(c);
  rect(0, 0, s, s, 4);
  pop();
}

// 3) Ribbon/streak: connects previous and current mouse points
function brushRibbon(x, y, c, s) {
  if (prevX === null) { prevX = x; prevY = y; }
  strokeWeight(max(2, s * 0.5));
  c.setAlpha(200);
  stroke(c);
  line(prevX, prevY, x, y);

  // add two soft offset lines for texture
  c.setAlpha(80);
  stroke(c);
  strokeWeight(max(1, s * 0.25));
  line(prevX + 2, prevY + 2, x + 2, y + 2);
  line(prevX - 2, prevY - 1, x - 2, y - 1);

  prevX = x; prevY = y;
}

// ===== Controls =====
function keyPressed() {
  if (key === '1') currentBrush = 0;            // soft circle
  if (key === '2') currentBrush = 1;            // rotating square
  if (key === '3') currentBrush = 2;            // ribbon/streak

  if (key === 'C' || key === 'c')               // cycle colour
    colorIndex = (colorIndex + 1) % palette.length;

  if (key === '+' || key === '=' ) sizeVal += 4;            // bigger
  if (key === '-' || key === '_' ) sizeVal = max(4, sizeVal - 4); // smaller

  if (key === 'E' || key === 'e') erasing = !erasing;       // toggle eraser
  if (key === 'X' || key === 'x') background(240);          // clear
  if (key === 'S' || key === 's') saveCanvas('activity3c-paint', 'png'); // save
}

// ===== HUD =====
function drawHUD() {
  push();
  noStroke();
  fill(0, 120);
  rectMode(CORNER);
  rect(8, 8, 210, 78, 8);
  fill(255);
  textSize(12);
  textLeading(16);
  text(
    `Brush: ${currentBrush + 1}  (1/2/3)
Color: ${palette[colorIndex]}  [C]
Size: ${sizeVal}  [+ / -]
Eraser: ${erasing ? 'ON' : 'OFF'}  [E]
Clear [X] • Save [S]`,
    16, 20
  );
  pop();
}
