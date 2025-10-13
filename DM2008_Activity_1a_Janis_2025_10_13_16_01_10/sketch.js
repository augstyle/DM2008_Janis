// DDM2008
// Activity 1a – Simple Creature
// Janis Lim Hui

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220, 230, 255);

  // body
  fill(0);
  rect(150, 200, 100, 60);

  // legs
  rect(155, 260, 20, 30);
  rect(225, 260, 20, 30);

  // head
  rect(115, 210, 40, 40);

  // ears or spikes
  triangle(135, 210, 155, 190, 175, 210);
  triangle(175, 210, 195, 190, 215, 210);

  // tail
  rect(250, 210, 25, 25);

  // eye and mouth
  fill(255);
  circle(130, 225, 10);
  fill(0);
  circle(130, 225, 4);

  noFill();
  stroke(255);
  strokeWeight(2);
  beginShape();
  vertex(135, 240);
  vertex(140, 245);
  vertex(145, 240);
  vertex(150, 245);
  vertex(155, 240);
  endShape();

  noStroke();
}