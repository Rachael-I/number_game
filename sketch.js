var guessItem = null;
var interval = 80;
var results = [];
var solution = null;
var gameOver = false;

function setup() {
  createCanvas(800, 300);
}

function draw() {
  var gameScore = getGameScore(results);
  
  if (gameScore.loss === 3 || gameScore.total === 10) {
    gameOver = true;
    displayGameOver(gameScore);
    return;
  }
  
  background(0); 
  if (frameCount === 1 || frameCount % interval === 0) {
    solution = null;
    guessItem = new GuessItem(width/2, height/2, 10);  
  } 
  
  if (guessItem) {
    guessItem.render();
  }
  
  if (solution === true || solution === false) {
    solutionMessage(gameScore.total, solution);
  }
}

function solutionMessage(seed, solution) {
  var trueMessages = [
    'FANTASTIC!',
    'GOOD JOB!',
    'IMPRESSIVE!',
    'TU MEKE!',
    'TINO PAI!',
    'KA PAI!'
  ];
  
  var falseMessages = [
    'MEH...',
    'DARN!',
    'BETTER LUCK NEXT TIME!',
    'Pffft',
    ':(' 
  ];
  
  var messages;
  
  push();
  textAlign(CENTER, CENTER);
  textSize(36);
  fill(237, 34, 93);
  randomSeed(seed * 10000);
  
  if (solution === true) {
    background(255);
    messages = trueMessages;
  } else if (solution === false) {
    background(0);
    messages = falseMessages;
  }
  
  translate(width/2, height/2);
  text(messages[parseInt(random(messages.length), 10)], 0, 0);
  randomSeed();
  pop()
}

function displayGameOver(score) {
  push();
  background(255);
  textAlign(CENTER, CENTER);
  translate(width/2-75, height/2-75);
  
  fill(237, 34, 93);
  textSize(26);
  text('GAME OVER!', 0, 0);
  fill(42, 110, 9);
  translate(0, 32);
  text('Kua mutu te kēmu!', 0, 0);
  
  fill(0);
  textSize(22);
  translate(0, 46);
  text('You have ' + score.win + ' correct guesses', 0, 0);
  fill(42, 110, 9);
  translate(0, 36);
  text('E ' + score.win + ' au whakautu tika', 0, 0);
  
  var alternatingValue = map(sin(frameCount/10), -1, 1, 0, 255);
  fill(237, 34, 93, alternatingValue);
  textSize(16);
  translate(0, 46);
  text('PRESS ENTER', 0, 0);
  pop();
}

function getGameScore(score) {
  var wins = 0;
  var losses = 0;
  var total = score.length;
  
  for(var i = 0; i < total; i++) {
    var item = score[i];
    if (item === true) {
      wins = wins + 1;
    } else {
      losses = losses + 1;
    }
  }
  return {win: wins, loss: losses, total: total}; 
}

function restartTheGame() {
  results = [];
  solution = null;
  gameOver = false;
}

function keyPressed() {
  if (gameOver === true) {
    if (keyCode === ENTER) {
    restartTheGame();
    return;
    }    
  }
  
  if (guessItem !== null) {
    console.log('you pressed', key);
    solution = guessItem.solve(key);
    if (solution) {
      results.push(true);
    } else {
      results.push(false);
    }
    guessItem = null;
  } else {
    console.log('nothing to be solved');
  }
}

function GuessItem(x, y, scl) {
  this.x = x;
  this.y = y;
  this.scale = scl;
  this.scaleIncrement = 0.33;
  this.content = getContent();
  this.alpha = 255;
  this.alphaDecrement = 6;
  this.solved;
  this.contentMap = {
    '1':'tahi',
    '2':'rua',
    '3':'toru',
    '4':'whā',
    '5':'rima',
    '6':'ono',
    '7':'whitu',
    '8':'waru',
    '9':'iwa',
    '0':'kore'
  };
  
  this.colours = [
   [63, 184, 175],
   [127, 199, 175],
   [218, 216, 167],
   [255, 158, 157],
   [255, 61, 127],
   [55, 191, 211],
   [159, 223, 82],
   [234, 209, 43],
   [250, 69, 8],
   [194, 13, 0] 
  ];
  
  function getContent() {
    return String(parseInt(random(10), 10));
  }
  
  this.solve = function(input) {
    if (input === this.content) {
      this.solved = true;
    } else {
      this.solved = false;
    }
  return this.solved;
  }
  
  this.drawEllipse = function(size, strkweight, speedMultiplier, seed) {
    push();
    randomSeed(seed);
    translate(this.x, this.y);
    scale(this.scale * 0.5 * speedMultiplier);
    var clr = this.colours[parseInt(random(this.colours.length), 10)];
    stroke(clr);
    
    noFill();
    strokeWeight(strkweight);
    ellipse(0, 0, size, size);
    randomSeed();
    pop();
  }
  
  this.render = function() {
    if (this.solved === false) {
      return;
    }
    
    this.drawEllipse(100, 15, 1.4, this.content * 1000);
    this.drawEllipse(80, 7, 1.2, this.content * 2000);
    this.drawEllipse(60, 5, 1.1, this.content * 3000);
    
    push();
    fill(255, this.alpha);
    textAlign(CENTER, CENTER);
    translate(this.x, this.y);
    scale(this.scale);
    text(this.contentMap[this.content], 0, 0);
    this.scale = this.scale + this.scaleIncrement;
    this.alpha = this.alpha - this.alphaDecrement;
    pop();
  }
}
