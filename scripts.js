const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const collisionCanvas = document.getElementById("collisionCanvas");
const collisionCtx = collisionCanvas.getContext("2d");
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;
let score = 0;
ctx.font = "50px Impact";

let ravens = [];
class Raven {
  constructor() {
    this.image = new Image();
    this.image.src = "raven.png";
    this.spriteWidth = 271;
    this.spriteHeight = 194;
    this.sizeModifier = Math.random() * 0.6 + 0.4;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.height);
    this.directionX = Math.random() * 5 + 3;
    this.directionY = Math.random() * 5 - 2.5;
    this.markedForDeath = false;
    this.frame = 0;
    this.timeSinceFlap = 0;
    this.flapInterval = Math.random() * 60 + 40;
    this.randomColors = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
    ];
    this.color =
      "rgb(" +
      this.randomColors[0] +
      "," +
      this.randomColors[1] +
      "," +
      this.randomColors[2] +
      ")";
  }
  update(deltaTime) {
    if (this.y < 0 || this.y > canvas.height - this.height) {
      this.directionY = -this.directionY;
    }
    this.x -= this.directionX;
    this.y += this.directionY;
    if (this.x < 0 - this.width) this.markedForDeath = true;
    this.timeSinceFlap += deltaTime;
    if (this.timeSinceFlap > this.flapInterval) {
      this.frame = this.frame > 4 ? 0 : this.frame + 1;
      this.timeSinceFlap = 0;
    }
  }
  draw() {
    collisionCtx.fillStyle = this.color;
    collisionCtx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.spriteWidth * this.frame,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + score, 50, 75);
}

window.addEventListener("click", function (e) {
  const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
  const pc = detectPixelColor.data;
  ravens.forEach((raven) => {
    if (
      raven.randomColors[0] === pc[0] &&
      raven.randomColors[1] === pc[1] &&
      raven.randomColors[2] === pc[2]
    ) {
      raven.markedForDeath = true;
      ++score;
    }
  });
});

function animate(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  collisionCtx.clearRect(0, 0, canvas.width, canvas.height);

  //For control between slow and fast comp
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  timeToNextRaven += deltaTime;
  if (timeToNextRaven > ravenInterval) {
    ravens.push(new Raven());
    timeToNextRaven = 0;
  }
  //End of control
  drawScore();
  //Array spread syntax
  [...ravens].forEach((raven) => raven.update(deltaTime));
  [...ravens].forEach((raven) => raven.draw());
  ravens = ravens.filter((raven) => !raven.markedForDeath);
  requestAnimationFrame(animate);
}

animate(0);
