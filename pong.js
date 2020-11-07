//choose difficulty from 1 to 5
// 1 being the least difficult and 5 being the most difficult 
let difficulty = 3;

let ballRadius = 10;
let posX = 350;
let posY = 250;



var c = document.getElementById("canvasID");
var ctx = c.getContext("2d");

let user = {
    x: 0,
    y: c.height/2 - 100/2,
    w: 10,
    h: 100,
    color: 'cyan',
    score: 0
}

let computer = {
    x: c.width - 10,
    y: c.height/2 - 100/2,
    w: 10,
    h: 100,
    color: 'yellow',
    score: 0
}
let ball = {
    x: c.width / 2,
    y: c.height / 2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: 'white'
}

function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}
function drawCircle(posX, posY, ballRadius, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(posX, posY, ballRadius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}
function drawText(t, x, y, color){
    ctx.fillStyle = color;
    ctx.font = '75px Ariel';
    ctx.fillText(t, x, y);
}

function render(){
    drawRect(0, 0, c.width, c.height, 'BLACK');
    //raquettes
    drawRect(user.x, user.y, user.w, user.h, user.color);
    drawRect(computer.x, computer.y, computer.w, computer.h, computer.color);
    //scores
    drawText(user.score, c.width/4, c.height/5, 'white');
    drawText(computer.score, 3 * c.width / 4, c.height / 5, 'white');
    //ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);

    if (computer.score > 4 && computer.score > user.score) {
        drawRect(0, 0, c.width, c.height, 'BLACK');
        drawText('Computer Wins', 120, 100, 'white');
    } else if (user.score > 4 && user.score > computer.score) {
        drawRect(0, 0, c.width, c.height, 'BLACK');
        drawText('User Wins', c.width / 8, c.height / 5, 'white');
    }
}
function game(){
    update();
    render();
}

let framePerSec = 50;

setInterval(game, 1000/framePerSec);

function resetBall(){
    ball.x = c.width/2;
    ball.y = c.height/2;
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}
function update(){
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    if(ball.y + ball.radius > c.height || ball.y - ball.radius < 0){
        ball.velocityY = -ball.velocityY;
    } 
    //scoring 
    if(ball.x - ball.radius < 0){
        computer.score++;
        //winner message 
        // if (computer.score > 4 && computer.score > user.score) {
        //     computer.score = 0;
        // }
        resetBall();
    } else if(ball.x + ball.radius > c.width){
        user.score++;
        // if (user.score > 4 && user.score > computer.score) {
        //     user.score = 0;
        //     drawRect(0, 0, c.width, c.height, 'BLACK');
        //     drawText('User Wins', c.width / 8, c.height / 5, 'white');
        // }
        resetBall();
    }

    let player = (ball.x < c.width / 2) ? user : computer;

    if (ballHitRaquette(ball, player)) {
        let collidePoint = ball.y - (player.y + player.h/2);

        collidePoint = collidePoint / (player.h / 2);

        let angleRad = (Math.PI / 4) * collidePoint;
        let direction = (ball.x < c.width / 2) ? 1 : -1;

        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = direction * ball.speed * Math.sin(angleRad);

        ball.speed += 0.1;
    }

    // computer raquette
    let computerLevel = 0.1;
    computer.y += (ball.y - (computer.y + computer.h/2)) * computerLevel;
}

function ballHitRaquette(b, p){
    p.top = p.y;
    p.bottom = p.y + p.h;
    p.left = p.x;
    p.right = p.x + p.w;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

let player = (ball.x < c.width / 2)? user : computer;

if(ballHitRaquette(ball, player)){
    let collidePoint = (ball.y - (player.y + player.h/2));
    collidePoint = collidePoint / (player.h/2);
    let angleRad = (Math.PI/4) * collidePoint;
    let direction = (ball.x < c.width/2)? 1 : -1;

    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = ball.speed * Math.sin(angleRad);

    ball.speed += 0.1;
}

//control user's raquette
c.addEventListener('mousemove', movePaddle);

function movePaddle(event){
    let rect = c.getBoundingClientRect();
    user.y = event.clientY - rect.top - user.h/2;
}

//results