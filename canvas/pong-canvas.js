/**
 * @fileoverview Pong game
 */

const canvasPongDiv = document.querySelector("div[pong]");
// TODO: remove debug
canvasPongDiv.style.display = "none"

const pongCanvas = canvasPongDiv.querySelector("canvas#pongCanvas");
const pongCtx = pongCanvas.getContext("2d");

/*
    Scale the canvas for smaller screens
 */
pongCanvas.height = 140 * scale;
pongCanvas.width = 420 * scale;

let pongSettings = {
    borderWidth: 5,
    playing: false,
    ball: {
        x: pongCanvas.width / 2,
        y: pongCanvas.height / 2,
        dx: 2,
        dy: -2,
        radius: 10 * scale,
    },
    paddle: {
        width: 8 * scale,
        height: 40 * scale,
        speed: 2
    },
    player: {
        x: 6,
        y: pongCanvas.height / 2 - 50,
        score: 0
    },
    computer: {
        x: pongCanvas.width - (8 + 6),
        y: pongCanvas.height / 2 - 50,
        score: 0
    }
}


canvasPongDiv.addEventListener("mousemove", (ev) => {
    const rect = pongCanvas.getBoundingClientRect();
    const mouseY = ev.clientY - rect.top;
    pongSettings.player.y = mouseY - pongSettings.paddle.height / 2;

    if (!pongSettings.playing)
        pongSettings.playing = true;

});

const minHeight = pongSettings.borderWidth + 1
const maxHeight = (pongCanvas.height - pongSettings.borderWidth) - (pongSettings.paddle.height + 1);
let score = {
    player: 0,
    computer: 0
}

// Border
pongCtx.fillStyle = "white"
pongCtx.fillRect(0, 0, pongCanvas.width, pongCanvas.height);

function updateCanvasPong() {
    pongCtx.fillStyle = "#000097";
    pongCtx.fillRect(5, 5, pongCanvas.width - 10, pongCanvas.height - 10);

    // Draw the background
    // dotted middle line
    pongCtx.strokeStyle = "white";
    pongCtx.beginPath();
    pongCtx.lineWidth = 5;
    pongCtx.setLineDash([6, 6]);
    pongCtx.moveTo(pongCanvas.width / 2, 0);
    pongCtx.lineTo(pongCanvas.width / 2, pongCanvas.height);
    pongCtx.stroke();
    pongCtx.closePath();
    pongCtx.setLineDash([]);

    // Draw the ball
    pongCtx.fillStyle = "white";
    pongCtx.beginPath();
    pongCtx.arc(pongSettings.ball.x, pongSettings.ball.y, pongSettings.ball.radius, 0, Math.PI * 2);
    pongCtx.fill();
    pongCtx.closePath();

    // Draw the scores
    pongCtx.font = "30px monospace";
    pongCtx.fillText(pongSettings.player.score, pongCanvas.width / 2 - 30, 30);
    pongCtx.fillText(pongSettings.computer.score, pongCanvas.width / 2 + 12, 30);


    // Draw the players
    pongCtx.fillStyle = "white";
    pongCtx.fillRect(
        pongSettings.player.x,
        Math.max(
            minHeight,
            Math.min(
                pongSettings.player.y,
                maxHeight
            )
        ),
        pongSettings.paddle.width,
        pongSettings.paddle.height
    );
    pongCtx.fillRect(pongSettings.computer.x,
        Math.max(
            minHeight,
            Math.min(
                pongSettings.computer.y,
                maxHeight
            )
        ),
        pongSettings.paddle.width,
        pongSettings.paddle.height
    );

    if (!pongSettings.playing) {
        pongCtx.font = "14px monospace";
        const text = "Move your mouse to start";

        pongCtx.fillText(text, pongCanvas.width / 2 - pongCtx.measureText(text).width / 2, pongCanvas.height - 10);
    } else {
        // TODO: moveball and moveai
        moveBall();
        moveAI();
    }
}

function resetBall() {
    pongSettings.ball.x = pongCanvas.width / 2;
    pongSettings.ball.y = Math.floor(Math.random() * (pongCanvas.height - pongSettings.borderWidth * 2)) + pongSettings.borderWidth * 2;
    pongSettings.ball.dx = -pongSettings.ball.dx;
    pongSettings.ball.dy = -pongSettings.ball.dy;
    if (Math.abs(pongSettings.ball.dx) < 4) {
        pongSettings.ball.dx += 0.4 * Math.sign(pongSettings.ball.dx);
        pongSettings.ball.dy += 0.4 * Math.sign(pongSettings.ball.dy);
    }
}

function moveBall() {
    pongSettings.ball.x += pongSettings.ball.dx;
    pongSettings.ball.y += pongSettings.ball.dy;

    if (pongSettings.ball.y + pongSettings.ball.radius > pongCanvas.height || pongSettings.ball.y - pongSettings.ball.radius < 0) {
        pongSettings.ball.dy = -pongSettings.ball.dy;
    }

    if (pongSettings.ball.x + pongSettings.ball.radius > pongCanvas.width) {
        pongSettings.player.score++;
        pongSettings.playing = false;
        resetBall();
    }

    if (pongSettings.ball.x - pongSettings.ball.radius < 0) {
        pongSettings.computer.score++;
        pongSettings.playing = false;
        resetBall();
    }

    const player = pongSettings.player;
    const computer = pongSettings.computer;
    const ball = pongSettings.ball;

    if (ball.x - ball.radius < player.x + player.width && ball.y > player.y && ball.y < player.y + player.height) {
        ball.dx = -ball.dx;
    }

    if ((ball.x + ball.radius) > computer.x && (ball.y > computer.y) && ball.y < (computer.y + computer.height)) {
        ball.dx = -ball.dx;
    }
}

function moveAI() {
    const computer = pongSettings.computer;
    const ball = pongSettings.ball;

    const computerCenter = computer.y + computer.height / 2;
    if (ball.y < computerCenter) {
        computer.y -= pongSettings.paddle.speed;
    } else {
        computer.y += pongSettings.paddle.speed;
    }
}

addCanvasRenderer(updateCanvasPong);

