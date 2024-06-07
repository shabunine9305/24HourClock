// ######################################################
// VARIABLES AND CONSTANTS
// ######################################################

const radius = 200;
const outerRadius = radius * 1.32;
const offset = 30;
const DEF_FPS = 30;
var secondaryOffset = 2;
var showRemainderArcs = true;
var paused = false;

var sunArc = {
  show : true,
  anim : {
    playing : false,
    growing : false,
    amount : 1,
    rotation : 0
  }
};

var gray1;
var white1;

var cnv;
const sc = window.SunCalc;
sc.lat = 42;
sc.long = -72;

var day_ = 1;

// let hands;

// ######################################################
// ######################################################

// x

// ######################################################
// SETUP
// ######################################################

function setup() {
  cnv = createCanvas(600, 600);
  
  cnv.elt.title = "R : Toggle remaining-time arcs\n" +
                  "S : Toggle daytime arc\n" +
                  "P : Toggle pause";

  // cnv.elt.addEventListener("contextmenu", e => e.preventDefault());
  
  // hands = createGraphics(width, height);
  
  sc.date = new Date();
  sc.dateOfLastUpdate = sc.date.getDate();
  
  sc.debugDate = null;
  // sc.debugDate = new Date("2023-06-21");
  // sc.debugDate = new Date("2023-12-21");
  
  ellipseMode(CENTER);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  angleMode(DEGREES);
  colorMode(HSL);
  pixelDensity(2);
  
  gray1 = color(0, 0, 60, 1);
  gray2 = color(0, 0, 20, 1);
  white1 = color(0, 0, 100, 1);
  
  frameRate(DEF_FPS);
}

// ######################################################
// ######################################################

// x

// ######################################################
// DRAW
// ######################################################

function draw() {
  
  // ###########################
  
  // sc.date = new Date("2023-10-20 16:20:00");
  sc.date = new Date();
  
  sc.times = sc.getTimes(sc.date, sc.lat, sc.long);
  
  if (sc.debugDate !== null) sc.times = sc.getTimes(sc.debugDate, sc.lat, sc.long);
  
//   if (frameCount % 120 === 0) {
// //     sc.date = new Date("2023-04-" + day_);
// //     sc.times = sc.getTimes(sc.date, sc.lat, sc.long);
// //     day_ += 1;
//     sc.dateOfLastUpdate = 21;
//   }
  // ###########################
  
  if (sc.dateOfLastUpdate !== sc.date.getDate()) {
    console.log("UPDATING FROM " + sc.dateOfLastUpdate + " TO " + sc.date.getDate());
    sc.dateOfLastUpdate = sc.date.getDate();
    sunArc.anim.playing = true;
  }
  // ###########################
  
  background(0);
  noFill();
  stroke(255);
  strokeWeight(2);
  textSize(30);
  
  // ###########################
  
  // line(width/2, 0, width/2, height);
  
  translate(width/2, height/2);
  
  // translate(0, -10); // compensate for sun arc
  
  circle(0, 0, radius*2);
  
  push();
    strokeWeight(5);
    stroke(gray1);
    circle(0, 0, outerRadius*2);
  pop();
  
  fill(255);
  
  // ###########################
  
  if (sunArc.show) sunArc.draw();
  
  // ###########################

  drawRadialLines();
  
  drawNumbers();
    
  push();
    // =======================
    strokeWeight(8);
    // =======================
  
    let millisInSec = sc.date.getSeconds() + sc.date.getMilliseconds() / 1000;
  
    second_ = map60(millisInSec);
  
    minute_ = map60(sc.date.getMinutes()) + map60(millisInSec / 60);
  
    hour_ = map24(sc.date.getHours()) +
      map24(sc.date.getMinutes() / 60) +
      millisInSec / 360;
    
    // =======================
    // minute arc
    if (showRemainderArcs) drawRemainderArcs(minute_, hour_);
  
    // =======================
    // hour hand
    drawHourHand(hour_);
  
    // =======================
    // minute hand
    drawMinuteHand(minute_);
  
    // =======================
    // second hand
    drawSecondHand(second_);
  
    // =======================
  pop();
  
  // ###########################
  // CENTRAL CIRCLE TO COVER THE HANDS
  noStroke();
  // fill(gray2);
  fill("#292929");
  circle(0, 0, 20);
  
  // ###########################
}

// ######################################################
// ######################################################

// x

// ######################################################
// OTHER FUNCTIONS
// ######################################################

function map24(t) {
  return map(t, 0, 24, 0, 360, true);
}
// ######################################################

function map60(t) {
  return map(t, 0, 60, 0, 360, true);
}
// ######################################################

function mapSunArc(t) {
  const minutesInDay = 24*60;
  return map(t, 0, minutesInDay, 0, 360) - 90;
}
// ######################################################

function setRotation(i, a) {
  if (i > 6 && i < 18) {
    rotate(a - 90);
 
  } else if (i !== 6 && i !== 18) {
    rotate(a + 90);
  }
}
// ######################################################

function drawHand(x, y, w, l) {
  line(x, y, x, y+l);
  triangle(x-w, y+l+w,
           x+w, y+l+w,
           x,   y+l-w);
}
// ######################################################

function drawHourHand(hour_) {
  push();
    stroke(white1);
    fill(white1);
    rotate(hour_);
    // ------------
    // line(0, 0, 0, -radius*0.7);
    drawHand(0, 0, 4, -radius*0.5);
    // ------------
    // strokeWeight(4);
    // stroke(gray1);
    // rotate(180);
    // line(0, 280, 0, 290);
    strokeWeight(3);
    // stroke(gray1);
    stroke("#296F49");
    rotate(180);
    blendMode(LIGHTEST);
    line(0, 202, 0, 260); // current hour marker;
    // ------------
  pop();
}

// ######################################################

function drawMinuteHand(minute_) {
   push();
      stroke(gray1);
      fill(gray1);
      rotate(minute_);
      // line(0, 0, 0, -radius*0.9);
      drawHand(0, 0, 2, -radius*0.7);
    pop(); 
}

// ######################################################

function drawSecondHand(second_) {  
  push();
    stroke("red");
    fill("red");
    strokeWeight(5);
    rotate(second_);
    // line(0, 0, 0, -radius*0.98);
    drawHand(0, 0, 2, -radius*0.9);
  pop();
}
// ######################################################

function drawRemainderArcs(minute_, hour_) {
  // ------------
  push();
    noStroke();
    fill(0, 0, 100, 0.2);

    rotate(minute_);
    arc(0, 0, radius*1.35, radius*1.35, -90, -90-minute_, PIE);
  pop();
  // ------------
  // hour arc
  push();
    noStroke();
    fill(0, 0, 100, 0.3);
    rotate(hour_);
    arc(0, 0, radius*0.93, radius*0.93, -90, -90-hour_, PIE);
  pop();
  // ------------
}
// ######################################################

function drawRadialLines() {
  push();
    stroke(gray2);
    fill(gray2);
    for (let k = 0; k < 6; k++) {
      // ------------
      strokeWeight(1);
      line(0, 20, 0, radius-60);
      rotate(15);
      // ------------
      strokeWeight(3);
      line(0, 20, 0, radius-20);
      rotate(15);      
      // ------------
      strokeWeight(1);
      line(0, 20, 0, radius-60);
      rotate(15);      
      // ------------
      strokeWeight(3);
      line(0, 20, 0, radius-20);
      rotate(15);
      // ------------
    }
  pop(); 
}
// ######################################################

function drawNumbers() {

  // ###########################
    // ###########################
  
  for (let i = 0; i < 24; i++) {
    
    // =======================
    
    let a = map(i, 0, 24, 0, 360) - 90;
    
    let x = (radius+offset) * cos(a);
    let y = (radius+offset) * sin(a);
    
    // =======================
    // DRAW HOURS
    push();
      translate(x, y);
      setRotation(i, a);
      text(i, 0, 0);
    
      if (i % 3 === 0) {
        stroke(gray1);
        noFill();
        circle(0, 0, 45);
      }
    pop();
    
    // =======================
    
    x = (radius-offset) * cos(a);
    y = (radius-offset) * sin(a);
    
    // =======================
    
    push();
      stroke(gray1);
      fill(gray1);
      rotate(a);
      line(0, outerRadius, 0, outerRadius-10);
    pop();
    
    // =======================
    // DRAW MINUTES
    if (i % 2 === 0) {
      push();
        let t = i/2 * 5;
        translate(x, y);
        setRotation(i, a);
        fill(gray1);
        stroke(gray1);
        textSize(25);
      
        text(t, 0, 0);
      pop();

      // ------------
      
      push();
        strokeWeight(3);
        rotate(a);
        line(0, radius, 0, radius-10);

        strokeWeight(2);
        for (let j = 1; j < 5; j++) {
          rotate(6);
          line(0, radius, 0, radius-5);
          
        }
      pop();
    }
    // =======================
  }
    // ###########################
  // ###########################
}
// ######################################################

function getRandomDate() {
  let m = floor(random(1, 13));
  return new Date("2023-" + m + "-01 12:00:00");
}

// ######################################################

function printSome(str, interval=30) {
  if (frameCount % interval) console.log(str);
}

// ######################################################
// ######################################################

// x

// ######################################################
// INPUT
// ######################################################

function keyPressed(event) {
  switch (event.code) {
    case 'KeyR':
      showRemainderArcs = !showRemainderArcs;
      break;
    case 'KeyS':
      sunArc.show = !sunArc.show;
      break;
    case 'KeyP':
      paused = !paused;
      frameRate(paused ? 0 : DEF_FPS);
      break;
    case 'KeyA':
      sunArc.anim.playing = true;
      
      if (event.shiftKey) {
        sc.debugDate = getRandomDate();
        print(sc.debugDate);
      }
      break;
  }
}

// ######################################################
// ######################################################

// x

// ######################################################
// DISPLAY SUN ARC
// ######################################################

sunArc.draw = function () {
  let dim = 570
  
//   const firstLightTime = 5*60 + 21;
//   const sunriseTime = 5*60 + 49 // 5:49
  
//   const sunsetTime = 19*60 + 36 // 7:36
//   const lastLightTime = 20*60 + 4;
  
  let t = sc.times;
  
  const currentTime = sc.date.getHours()*60 + sc.date.getMinutes();
  
  const firstLightTime = t.dawn.getHours()*60 + t.dawn.getMinutes();
  const sunriseTime = t.sunrise.getHours()*60 + t.sunrise.getMinutes();
  
  const sunsetTime = t.sunset.getHours()*60 + t.sunset.getMinutes();
  const lastLightTime = t.dusk.getHours()*60 + t.dusk.getMinutes();
  
  var currentTimeAngle = mapSunArc(currentTime);
  var firstLightAngle = mapSunArc(firstLightTime);
  var startAngle = mapSunArc(sunriseTime);
  var endAngle = mapSunArc(sunsetTime);
  var lastLightAngle = mapSunArc(lastLightTime);
  
  push();
    
    if (sunArc.anim.playing) {
      
      
      if (!sunArc.anim.growing) {
        rotate(sunArc.anim.rotation);
        sunArc.anim.rotation = constrain((sunArc.anim.rotation + 2.1), 0, 135); // change max to mapped value
        startAngle = map(sunArc.anim.amount, 0, 1, lastLightAngle, startAngle);
        firstLightAngle = map(sunArc.anim.amount, 0, 1, lastLightAngle, firstLightAngle);

        sunArc.anim.amount = constrain((sunArc.anim.amount - 0.015), 0, 1);
        
        if (sunArc.anim.amount <= 0.04) {
          sunArc.anim.growing = true;
          sunArc.anim.rotation = 0;
        }
      } else {
        endAngle = map(sunArc.anim.amount, 0, 1, firstLightAngle, endAngle);
        lastLightAngle = map(sunArc.anim.amount, 0, 1, firstLightAngle, lastLightAngle);
        
        sunArc.anim.amount = constrain((sunArc.anim.amount + 0.017), 0, 1);
        
        if (sunArc.anim.amount === 1) {
          sunArc.anim.growing = false;
          sunArc.anim.playing = false;
          sunArc.anim.rotation = 0;
        }
      }
    }
  
    noFill();
    strokeWeight(15);
    colorMode(RGB);
    
    let steps = 20;
    let intervalSize = abs(abs(firstLightAngle) - abs(startAngle))/steps;
  
    let start = firstLightAngle;
    for (let i = 0; i < steps; i++) {
      
      let opacity = map(start, currentTimeAngle, firstLightAngle, 1, 0);
      
      c = lerpColor(color("#08B1FF"), color("yellow"), i/steps);
      // c = lerpColor(color("#8254FF"), color("yellow"), i/steps);
      
      // colorMode(HSL);
      
      // c.setAlpha(opacity);
      
      stroke(c);
      arc(0, 0, dim, dim, start, start+intervalSize);
      start += intervalSize;
    }

    stroke("yellow");
    arc(0, 0, dim, dim, startAngle, endAngle);
  
    intervalSize = abs(abs(lastLightAngle) - abs(endAngle))/steps;
  
    start = endAngle;
    for (let j = 0; j < steps; j++) {
      
      let opacity = map(start, currentTimeAngle, firstLightAngle, 1, 0);
      
      c = lerpColor(color("yellow"), color("#EE5C12"), j/steps);
      
      // colorMode(HSL);
      
      // c.setAlpha(opacity);
      
      stroke(c);
      arc(0, 0, dim, dim, start, start+intervalSize);
      start += intervalSize;
    }
    
    // stroke("red");
    // arc(0, 0, 500, 500, -90, 10-90);
  
  pop();
}

// ######################################################
// ######################################################