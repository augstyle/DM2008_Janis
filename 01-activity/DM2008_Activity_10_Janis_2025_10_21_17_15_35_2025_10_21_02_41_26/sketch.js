//Activity 10 Control Centre
//Janis Lim

let sizeSlider, valueBadge, shapeBtns = {};
let colorBtn, colorPicker;
let currentShape = "ellipse";
let shapeColor;

function setup() {
  createCanvas(760, 460);

  // ---------- tiny CSS (for pretty UI) ----------
  createElement("style", `
    :root { --panel:#ffffff; --ink:#222; --muted:#6b7280; --accent:#111; }
    * { font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
    .panel {
      position:absolute; top:18px; left:18px;
      background:var(--panel); padding:14px 16px; border-radius:14px;
      box-shadow:0 12px 30px rgba(0,0,0,.12);
      display:flex; flex-direction:column; gap:10px; min-width:280px;
    }
    .row { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
    .title { font-weight:700; letter-spacing:.2px; color:var(--ink); }
    .caption { color:var(--muted); font-size:12px; margin-top:-4px; }
    .btn {
      background:#111; color:#fff; border:none; border-radius:10px;
      padding:8px 12px; cursor:pointer; transition:.15s transform, .15s opacity;
    }
    .btn:hover { transform: translateY(-1px); }
    .seg { display:flex; gap:6px; }
    .seg button {
      background:#f3f4f6; color:#111; border:none; border-radius:999px;
      padding:7px 12px; cursor:pointer; transition:.15s background,.15s color;
    }
    .seg button.active { background:#111; color:#fff; }
    .badge {
      background:#111; color:#fff; border-radius:999px;
      padding:4px 8px; font-size:12px; margin-left:4px;
    }
    input[type="range"]{ accent-color:#111; }
  `);

  // ---------- panel ----------
  const panel = createDiv().addClass("panel");

  createDiv("Control Center").addClass("title").parent(panel);
  createDiv("Tweak the shape in real time.").addClass("caption").parent(panel);

  // color controls
  const row1 = createDiv().addClass("row").parent(panel);
  colorBtn = createButton("🎨 Random color").addClass("btn").parent(row1);
  colorBtn.mousePressed(randomShapeColor);

  colorPicker = createColorPicker("#2a2015").parent(row1);
  colorPicker.input(() => shapeColor = color(colorPicker.value()));

  // size controls
  const row2 = createDiv().addClass("row").parent(panel);
  createSpan("Size").parent(row2);
  sizeSlider = createSlider(40, 260, 150, 1).parent(row2).style("width","160px");
  valueBadge = createSpan(`${sizeSlider.value()}px`).addClass("badge").parent(row2);

  // shape segmented buttons
  const row3 = createDiv().addClass("row").parent(panel);
  createSpan("Shape").parent(row3);
  const seg = createDiv().addClass("seg").parent(row3);
  ["ellipse","square","triangle","diamond"].forEach(name => {
    const b = createButton(name).parent(seg);
    b.mousePressed(() => setShape(name));
    shapeBtns[name] = b;
  });
  setShape("ellipse");

  // start color
  randomShapeColor();

  noStroke();
}

// ---------- drawing ----------
function draw() {
  drawGradientBackground();

  // "stage" card on the right
  push();
  rectMode(CORNER);
  noStroke();
  fill(255);
  rect(width*0.42, 24, width*0.54, height-48, 12);
  pop();

  // update UI mirror
  valueBadge.html(`${sizeSlider.value()}px`);

  // draw pretty shape with soft shadow
  const s  = sizeSlider.value();
  const cx = width*0.70;
  const cy = height*0.52;

  push();
  drawingContext.shadowColor = "rgba(0,0,0,.25)";
  drawingContext.shadowBlur  = 24;
  drawingContext.shadowOffsetY = 8;

  fill(shapeColor);
  noStroke();

  if (currentShape === "ellipse") {
    circle(cx, cy, s);
  } else if (currentShape === "square") {
    rectMode(CENTER);
    rect(cx, cy, s, s, 10);
  } else if (currentShape === "triangle") {
    triangle(cx - s*0.62, cy + s*0.36,
             cx + s*0.62, cy + s*0.36,
             cx,           cy - s*0.72);
  } else if (currentShape === "diamond") {
    beginShape();
    vertex(cx,         cy - s*0.65);
    vertex(cx + s*0.65, cy);
    vertex(cx,         cy + s*0.65);
    vertex(cx - s*0.65, cy);
    endShape(CLOSE);
  }
  pop();
}

// ---------- helpers ----------
function setShape(name){
  currentShape = name;
  // toggle active pill
  Object.entries(shapeBtns).forEach(([n, b])=>{
    if(n===name) b.addClass("active"); else b.removeClass("active");
  });
}

function randomShapeColor(){
  // tasteful dark-choco variance
  const r = 40 + random(0, 30);
  const g = 30 + random(0, 25);
  const b = 20 + random(0, 20);
  shapeColor = color(r, g, b);
  colorPicker.value(shapeColor.toString('#rrggbb'));
}

function drawGradientBackground(){
  // warm subtle gradient using canvas API
  const g = drawingContext.createLinearGradient(0, 0, 0, height);
  g.addColorStop(0,   "#f4d2a5");
  g.addColorStop(1.0, "#d39b52");
  drawingContext.fillStyle = g;
  rect(0, 0, width, height);
}
