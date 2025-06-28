const myCanvas = document.getElementById('myCanvas');
const spanSpeed = document.getElementById('speed');
const ctx = myCanvas.getContext('2d');
let ballArray = [];
let LEFT=false,RIGHT=false,UP=false,DOWN=false;
let upHeldTime = 0, downHeldTime = 0, leftHeldTime = 0, rightHeldTime = 0;
let playerBall = null;

myCanvas.focus(); 
// event listeners
myCanvas.addEventListener("keydown", function(event) {
        
        if(event.key === "ArrowUp") {
            UP = true;
        }
        if(event.key === "ArrowDown") {
            DOWN = true;
        }
        if(event.key === "ArrowLeft") {
            LEFT = true;
        }
        if(event.key === "ArrowRight") {
            RIGHT = true;
        }
        
        
    })

    myCanvas.addEventListener("keyup", function(event) {
        if(event.key === "ArrowUp") {
            UP = false;
        }
        if(event.key === "ArrowDown") {
            DOWN = false;
        }
        if(event.key === "ArrowLeft") {
            LEFT = false;
        }
        if(event.key === "ArrowRight") {
            RIGHT = false;
        }
        
    }) 

//ball Class
class Ball{
    constructor(x,y,radius,color){
        this.x = x;
        this.y = y;
        this.vy= 0;
        this.vx= 0;
        this.acceleration = 0.08;
        this.friction = 0.98;
        this.radius = radius;
        this.color = color;
        this.player=false;
        
        this.renderBall()
        ballArray.push(this);
    }


     renderBall(){
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

    displayDirection() {
        let direction = Math.atan2(this.vy, this.vx); // angle in radians
    let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy); // magnitude

    let startX = this.x;
    let startY = this.y;
    let endX = startX + Math.cos(direction) * speed * 10;
    let endY = startY + Math.sin(direction) * speed * 10;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = "green";
    ctx.lineWidth = 2;
    ctx.stroke();

    }

   
} 

function detectMovements(ball) {
   
    
   
    
    if(UP) {
        upHeldTime++;
        
        ball.vy -= ball.acceleration + (upHeldTime * 0.001); 
    }
    else{
        upHeldTime = 0;
    }
    if(DOWN) {
        downHeldTime++;
        ball.vy += ball.acceleration + (downHeldTime * 0.001);
        
    }
    else{
        downHeldTime = 0;
    }
    if(LEFT) {
        leftHeldTime++;
        ball.vx -= ball.acceleration + (leftHeldTime * 0.001);

    }
    else{
        leftHeldTime = 0;
    }
    if(RIGHT) {
     
    rightHeldTime++;
        ball.vx += ball.acceleration + (rightHeldTime * 0.001);
    }
    else{
        rightHeldTime = 0;
    }
    if(UP && RIGHT) {
        upHeldTime++;
        rightHeldTime++;
        
        ball.vx += ball.acceleration + (rightHeldTime * 0.001);
        ball.vy -= ball.acceleration + (upHeldTime * 0.001);
    }
    if(UP && LEFT) {
        upHeldTime++;
        leftHeldTime++;
        ball.vx -= ball.acceleration + (leftHeldTime * 0.001);
        ball.vy -= ball.acceleration + (upHeldTime * 0.001);
    }
    if(DOWN && RIGHT) {
        downHeldTime++;
        rightHeldTime++;
        ball.vx += ball.acceleration + (rightHeldTime * 0.001);
        ball.vy += ball.acceleration + (downHeldTime * 0.001);
        
    }
    if(DOWN && LEFT) {
        downHeldTime++;
        leftHeldTime++;
        ball.vx -= ball.acceleration + (leftHeldTime * 0.001);
        ball.vy += ball.acceleration + (downHeldTime * 0.001);
    }
    
   


}


function calculateCollision(){
for (let i = 0; i < ballArray.length; i++) {
  for (let j = i + 1; j < ballArray.length; j++) {
    let ball= ballArray[i];
    let otherball = ballArray[j];
     if(ball != otherball){
           let distance = Math.sqrt(Math.pow(ball.x - otherball.x, 2) + Math.pow(ball.y - otherball.y, 2));
           if( distance == 0) {
                distance = 0.1; // Prevent division by zero
           }
           let collisionDetected=distance < ball.radius + otherball.radius
           if(collisionDetected){
            
             let overlap = ball.radius + otherball.radius - distance;
    let nx = (otherball.x - ball.x) / distance;
    let ny = (otherball.y - ball.y) / distance;

    ball.x -= nx * (overlap / 2);
    ball.y -= ny * (overlap / 2);
    otherball.x += nx * (overlap / 2);
    otherball.y += ny * (overlap / 2);

    // Bounce velocities
    let transferFactor = 1.2;
    ball.vx *= -1;
    ball.vy *= -1;
    otherball.vx = -ball.vx * transferFactor;
    otherball.vy = -ball.vy * transferFactor;
           }
        }

  }}
}


function calculateCoordinates(){
ballArray.forEach(ball=>{
        ball.vx *= ball.friction;
    ball.vy *= ball.friction;
    ball.x += ball.vx;
    ball.y += ball.vy;
    
    // Boundary collision detection
    if (ball.x + ball.radius > myCanvas.width) {
        ball.x = myCanvas.width - ball.radius;
        ball.vx *= -1; // Reverse direction
    } else if (ball.x - ball.radius < 0) {
        ball.x = ball.radius;
        ball.vx *= -1; // Reverse direction
    }
    if (ball.y + ball.radius > myCanvas.height) {
        ball.y = myCanvas.height - ball.radius;
        ball.vy *= -1; // Reverse direction
    } else if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
        ball.vy *= -1; // Reverse direction
    }
    })
}

function calculateSpeed() {
    if (playerBall) {
        let speed = Math.sqrt(playerBall.vx * playerBall.vx + playerBall.vy * playerBall.vy);
        spanSpeed.textContent = speed.toFixed(2)+ ' px/s';
        
    }
}
function gameLoop(){
    calculateCollision();
    calculateCoordinates();
    calculateSpeed();
    
     ctx.clearRect(0, 0,640, 640);
    ballArray.forEach(ball => {
        ball.renderBall();
        if (ball.player) {
            detectMovements(ball);
            ball.displayDirection();
        }
        
        
    });
    requestAnimationFrame(gameLoop);
}




function init() {
    
    let player = new Ball(100, 100, 30, 'red');
    player.player = true;
    playerBall = player;
    new Ball(200, 200, 50, 'blue');
new Ball(350, 200, 50, 'green');
    gameLoop();
}

init();