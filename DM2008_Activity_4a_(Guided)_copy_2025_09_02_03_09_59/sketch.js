// DM2008 – Activity 4a Extended
// Three Cookies with Unique Movement Directions

let cookies = [];
let flavors = ["chocolate", "vanilla", "strawberry", "green tea"];

function setup() {
  createCanvas(400, 400);
  noStroke();

  // Create 3 random cookies
  for (let i = 0; i < 3; i++) {
    let flavor = random(flavors);
    let size = random(60, 90);
    let x = random(size / 2, width - size / 2);
    let y = random(size / 2, height - size / 2);
    cookies.push(new Cookie(flavor, size, x, y, i));
  }
}

function draw() {
  background(230);

  for (let cookie of cookies) {
    cookie.show();
  }
}

class Cookie {
  constructor(flavor, size, x, y, id) {
    this.flavor = flavor;
    this.size = size;
    this.x = x;
    this.y = y;
    this.id = id; // unique ID for assigning movement pattern
  }

  show() {
    // Draw cookie base
    if (this.flavor == "chocolate") {
      fill(196, 146, 96);
    } else if (this.flavor == "vanilla") {
      fill(240, 220, 170);
    } else if (this.flavor == "strawberry") {
      fill(255, 182, 193);
    } else if (this.flavor == "green tea") {
      fill(180, 220, 140);
    } else {
      fill(220);
    }

    ellipse(this.x, this.y, this.size);

    this.drawChips();
  }

  drawChips() {
    if (this.flavor == "chocolate") {
      fill(80, 40, 20);
      circle(this.x - 15, this.y - 10, 6);
      circle(this.x + 10, this.y - 5, 6);
      circle(this.x - 5, this.y + 10, 6);
    } else if (this.flavor == "vanilla") {
      fill(100, 60, 40);
      circle(this.x - 20, this.y - 15, 4);
      circle(this.x + 15, this.y + 5, 4);
      circle(this.x - 5, this.y + 15, 4);
      circle(this.x + 5, this.y - 10, 4);
    } else if (this.flavor == "strawberry") {
      fill(255, 105, 180);
      triangle(this.x - 10, this.y - 10, this.x - 5, this.y - 15, this.x, this.y - 10);
      triangle(this.x + 5, this.y + 5, this.x + 10, this.y + 10, this.x + 15, this.y + 5);
      triangle(this.x - 15, this.y + 10, this.x - 10, this.y + 15, this.x - 5, this.y + 10);
    } else if (this.flavor == "green tea") {
      fill(90, 130, 60);
      rect(this.x - 10, this.y - 10, 5, 5);
      rect(this.x + 8, this.y - 6, 5, 5);
      rect(this.x - 5, this.y + 8, 5, 5);
    }
  }

  move(keyCode) {
    // Each cookie moves differently based on its id
    if (this.id == 0) {
      // Left-right movement
      if (keyCode === LEFT_ARROW) this.x -= 10;
      if (keyCode === RIGHT_ARROW) this.x += 10;
    } else if (this.id == 1) {
      // Up-down movement
      if (keyCode === UP_ARROW) this.y -= 10;
      if (keyCode === DOWN_ARROW) this.y += 10;
    } else if (this.id == 2) {
      // Diagonal movement
      if (keyCode === LEFT_ARROW || keyCode === UP_ARROW) {
        this.x -= 7;
        this.y -= 7;
      }
      if (keyCode === RIGHT_ARROW || keyCode === DOWN_ARROW) {
        this.x += 7;
        this.y += 7;
      }
    }
  }
}

// Move cookies in their own way
function keyPressed() {
  for (let cookie of cookies) {
    cookie.move(keyCode);
  }
}

// Change all cookie flavors on click
function mousePressed() {
  for (let cookie of cookies) {
    cookie.flavor = random(flavors);
  }
}
