var myGamePiece;
var myObstacles = [];
var myScore;
let barrior;
let barrior2;
let barrior3;
let score = 0;
let hasCrashed = false;

function startGame() {
    barrior2 = new Component(10, 90, "yellow", 470, 90);
    barrior3 = new Component(10, 90, "green", 470, 180);
    barrior = new Component(10, 270, "red", 470, 0);

    myGamePiece = new Component(30, 30, "red", 10, 120);
    myGamePiece.gravity = 0.05;
    myScore = new Component("30px", "Consolas", "black", 280, 40, "text");
    myGameArea.start();
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

class Component {
    constructor(width, height, color, x, y, type) {
        this.type = type;
        this.score = 0;
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.x = x;
        this.y = y;
        this.gravity = 0;
        this.gravitySpeed = 0;
        this.color = color;
    }
    update() {
        let ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = this.color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    newPos() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }
    hitBottom() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    crashWith(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        if (myright >= otherleft && otherobj === barrior && !hasCrashed) {
            hasCrashed = true;

            if (mytop <= 90) {

                score += 200;
            }
            else if (mytop < 180) {
                score += 500;
            }
            else {
                score +=1000;
            }

            myScore.text = "SCORE: " + score;
            myGameArea.clear();
            myScore.update();
            myGamePiece.newPos();
            myGamePiece.update();
            barrior.update();
            barrior2.update();
            barrior3.update();
            return true;
        }
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            return false;
        }

        return true;
    }
}


function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i]) || myGamePiece.crashWith(barrior)) {
            return;
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    score += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        minGap = 200;
        maxGap = 300;
        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        myObstacles.push(new Component(10, height, "green", x, 0));
        myObstacles.push(new Component(10, x - height - gap, "green", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    myScore.text = "SCORE: " + score;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
    myGamePiece.x += 0.5;
    barrior.update();
    barrior2.update();
    barrior3.update();

}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}

