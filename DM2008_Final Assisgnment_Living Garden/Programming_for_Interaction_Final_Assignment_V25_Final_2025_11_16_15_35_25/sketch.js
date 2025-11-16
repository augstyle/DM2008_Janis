// LIVING GARDEN 

// ---------- serial ----------
let port, reader, connected=false, latest="OFF", bloom=0, t=0;

// ---------- palette ----------
const BEIGE = "#f6f1e7";
const GOLD  = "#cfa73a";
const THREAD= "#ad8f3a";
const WHITE = "#fffaf3";
const PETAL = "rgba(160,140,110,0.18)";
const GAUZE = "rgba(120,100,85,0.10)";

// ---------- layout ----------
const big = { x:240, y:605, r:170 };
const f1  = { x:150, y:110, r:104 };
const f2  = { x:350, y:155, r:102 };
const f3  = { x:740, y:210, r:104 };
const bfC = { x:820, y:480 };

// sparkles
const SPARK_SEEDS = 120;
let sparkleSeed = 7331;

function setup(){
  createCanvas(1024, 768);
  pixelDensity(2);
  angleMode(DEGREES);
  noLoop();

  const btn = createButton("Connect Flora");
  btn.id("connectBtn"); btn.mousePressed(connectSerial);
  const style = document.createElement("style");
  style.textContent = `
    body{margin:0;background:${BEIGE};font-family:system-ui}
    #connectBtn{position:fixed;left:16px;top:12px;background:${GOLD};
      color:#fff;border:none;padding:8px 12px;font-weight:700;border-radius:8px;cursor:pointer}
  `;
  document.head.appendChild(style);

  loop();
}

async function connectSerial(){
  try{
    port = await navigator.serial.requestPort();
    await port.open({ baudRate:115200 });
    const dec = new TextDecoderStream();
    port.readable.pipeTo(dec.writable);
    reader = dec.readable.getReader();
    connected = true;
    readLoop();
  }catch(e){ console.error(e); }
}

async function readLoop(){
  while(connected){
    const { value, done } = await reader.read();
    if (done || !value) break;
    const v = value.trim();
    if (v.includes("ON"))  latest = "ON";
    if (v.includes("OFF")) latest = "OFF";
  }
}

function draw(){
  background(BEIGE);
  t += 0.4;
  bloom += ((latest==="ON"?1:0) - bloom) * 0.10;

  fabricTexture();

  // flowers
  laceFlower(big.x, big.y, big.r, bloom, 28, true);
  laceFlower(f1.x, f1.y, f1.r, bloom, 18);
  laceFlower(f2.x, f2.y, f2.r, bloom, 18);
  laceFlower(f3.x, f3.y, f3.r, bloom, 18);

  // NEW: wavy dotted connectors
  const opts = { amp: 26, step: 10, size: 5, wavelength: 120, phase: 0 };
  dottedWavyLink(big.x,big.y,big.r,  f1.x,f1.y,f1.r,  opts);
  dottedWavyLink(f1.x,f1.y,f1.r,    f2.x,f2.y,f2.r,  {...opts, amp:22, phase: PI/3});
  dottedWavyLink(f2.x,f2.y,f2.r,    f3.x,f3.y,f3.r,  {...opts, amp:18, phase: PI/1.8});

  // butterfly + lamp (no connector to big flower)
  butterfly(bfC.x, bfC.y, 220, bloom);
  floraGlow(740, 700, 36, bloom);

  // slow sparkles
  sparkles();
}

/* ================= FLOWERS / BUTTERFLY ================= */

function laceFlower(cx,cy,R,b,petals=18,shadow=false){
  push(); translate(cx,cy);
  const bb = easeOutCubic(b);
  const open = lerp(R*0.28, R*0.9, bb);

  if (shadow){
    noStroke(); fill(GAUZE);
    drawingContext.filter = "blur(1.2px)";
    circle(0,0,R*1.28);
    drawingContext.filter = "none";
  }

  stroke(WHITE); strokeWeight(2.1);
  for(let a=0;a<360;a+=360/petals) line(0,0, cos(a)*open, sin(a)*open);

  for(let i=0;i<petals;i++){
    const a=(360/petals)*i-90; push(); rotate(a);

    noStroke(); fill(PETAL);
    beginShape();
    vertex(0, -R*0.12);
    bezierVertex(R*0.34,-open*0.34, R*0.34,-open*0.9, 0,-open);
    bezierVertex(-R*0.34,-open*0.9, -R*0.34,-open*0.34, 0,-R*0.12);
    endShape(CLOSE);

    stroke(GOLD); strokeWeight(2); noFill();
    beginShape();
    vertex(0, -R*0.12);
    bezierVertex(R*0.31,-open*0.30, R*0.31,-open*0.86, 0,-open);
    bezierVertex(-R*0.31,-open*0.86, -R*0.31,-open*0.30, 0,-R*0.12);
    endShape();

    stroke(THREAD); strokeWeight(1.2);
    for(let r=0;r<5;r++){ const yy=lerp(-R*0.14,-open*0.95,r/4); line(0,-R*0.06,0,yy); }
    pop();
  }

  noStroke(); fill(GOLD);
  const ir = lerp(R*0.22, R*0.34, easeOutCubic(b));
  for(let a=0;a<360;a+=14){ circle(cos(a)*ir, sin(a)*ir, 3); }

  drawingContext.shadowBlur = 30 * (0.6+0.4*b);
  drawingContext.shadowColor = "rgba(255,200,120,0.9)";
  fill(WHITE); circle(0,0, lerp(10, 24, b));
  drawingContext.shadowBlur = 0;
  pop();
}

function butterfly(cx,cy,size,b){
  push(); translate(cx,cy);
  const bb = easeOutCubic(b);
  const span = size*0.42 + size*0.24*bb;

  // body
  stitchedVine([[0,-span*0.75],[0,span*0.75]], 5, 4);

  // wings
  drawWing(+1, span, size*0.68, bb);
  drawWing(-1, span, size*0.68, bb);
  pop();
}
function drawWing(side,span,R,bb){
  push(); scale(side,1);
  const pts=[[12,-R*0.55],[span*0.55,-R*0.42],[span*0.85,0],[span*0.55,R*0.42],[12,R*0.55],[0,R*0.1]];
  noStroke(); fill(PETAL); beginShape(); for(const p of pts) vertex(p[0],p[1]); endShape(CLOSE);
  stitchedVine(pts.concat([[12,-R*0.55]]),4,4);
  noStroke(); fill(GOLD);
  for(let a=-70;a<=70;a+=12){
    const rr=R*0.42; circle(span*0.38+cos(a)*rr*0.36, sin(a)*rr*0.36, 2.2);
  }
  pop();
}

function floraGlow(x,y,r,b){
  push(); translate(x,y);
  noStroke(); drawingContext.shadowBlur = 22*(0.6+0.4*b);
  drawingContext.shadowColor = "rgba(255,200,140,0.85)";
  fill(WHITE); circle(0,0,r*0.6); drawingContext.shadowBlur = 0;
  stroke(GOLD); strokeWeight(5); noFill(); arc(0,-r*0.9,28,18,200,340);
  pop();
}

/* ================= VINES / SPARKLES / UTILS ================= */

// Dash of gold with dotted top-stitch
function stitchedVine(pts, w=6, dotStep=4){
  noFill(); stroke(GOLD); strokeWeight(w); strokeJoin(ROUND); strokeCap(ROUND);
  beginShape();
  curveVertex(pts[0][0], pts[0][1]);
  for(const p of pts) curveVertex(p[0],p[1]);
  curveVertex(pts[pts.length-1][0], pts[pts.length-1][1]);
  endShape();

  strokeWeight(2);
  const steps=180;
  for(let s=0;s<=steps;s+=dotStep){
    const p=s/steps, pos=pointOnPolyline(pts,p);
    point(pos.x,pos.y);
  }
}

// NEW: dotted, wavy connector from the rim of flower A to rim of flower B
function dottedWavyLink(ax,ay,ar, bx,by,br, opt){
  const { amp=24, step=10, size=5, wavelength=120, phase=0 } = opt||{};
  // direction A->B
  const dx = bx-ax, dy = by-ay;
  const len = max(1, sqrt(dx*dx + dy*dy));
  const ux = dx/len, uy = dy/len;               // unit tangent
  const nx = -uy, ny = ux;                      // unit normal
  // start/end points on the RIMS
  const start = { x: ax + ux*ar*0.95, y: ay + uy*ar*0.95 };
  const end   = { x: bx - ux*br*0.95, y: by - uy*br*0.95 };

  // number of dots
  const dots = floor(dist(start.x,start.y,end.x,end.y) / step);

  noStroke(); fill(GOLD);
  for(let i=0;i<=dots;i++){
    const p = i/dots;
    const bxp = lerp(start.x, end.x, p);
    const byp = lerp(start.y, end.y, p);
    const offset = amp * sin((TWO_PI*(len*p)/wavelength) + phase);
    const px = bxp + nx * offset;
    const py = byp + ny * offset;
    circle(px, py, size);
  }
}

function sparkles(){
  randomSeed(sparkleSeed);
  const speed = 0.002 + 0.002*bloom;
  const extra = floor(50 * bloom);
  const total = SPARK_SEEDS + extra;

  noStroke();
  for(let i=0;i<total;i++){
    const nx = noise(i*0.13, t*speed);
    const ny = noise(i*0.27, t*speed + 50);
    const x = nx*width;
    const y = ny*height;
    const tw = 0.85 + 0.5*sin(t*0.5 + i*9);
    const sz = tw*random(1.0, 2.6 + 0.8*bloom);
    fill(lerpColor(color("#d8bf76"), color("#c89a2a"), 0.5 + 0.5*sin(i*5)));
    circle(x, y, sz);
  }
}

function fabricTexture(){
  randomSeed(99);
  noStroke();
  for(let i=0;i<220;i++){
    fill(255,230,200, random(8,15));
    circle(random(width), random(height), random(0.5,1.5));
  }
}

function pointOnPolyline(pts,p){
  const n=pts.length-1, u=constrain(p,0,1)*n, i=min(floor(u),n-1), tt=u-i;
  return { x: lerp(pts[i][0],pts[i+1][0],tt), y: lerp(pts[i][1],pts[i+1][1],tt) };
}
function easeOutCubic(x){ return 1 - pow(1-x,3); }
