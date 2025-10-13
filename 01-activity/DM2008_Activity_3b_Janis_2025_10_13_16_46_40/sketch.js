// DDM2008
// Activity 3b – One Function Wonder
// Janis Lim Hui

function setup() {
  createCanvas(400, 400);
  rectMode(CENTER);
  noStroke();
  colorMode(HSB, 360, 100, 100, 100);
}

function draw() {
  background(220, 10, 95);

  // draw a grid of flower-like shapes
  for (let x = 60; x <= width - 60; x += 80) {
    for (let y = 60; y <= height - 60; y += 80) {
      let hueVal = map(x + y, 0, width + height, 0, 360);
      myFlower(x, y, 35, hueVal);
    }
  }
}

/*
  Custom function that draws a simple geometric flower
  Parameters:
    x, y → position
    s → size
    h → base hue (color)
*/
function myFlower(x, y, s, h) {
  push();
  translate(x, y);

  fill(h, 80, 100, 90);
  for (let i = 0; i < 6; i++) {
    rotate(PI / 3); // rotate by 60° each petal
    ellipse(0, s / 2, s / 2, s);
  }

  fill(h + 180, 80, 50, 90);
  circle(0, 0, s / 2); // center

  pop();
}
