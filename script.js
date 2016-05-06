//Global Variables
var window;
var document;
var ctx;
var play; 

var WIDTH = 600;
var HEIGHT = 400;
var LEFT = false;
var RIGHT = true;
var score1 = 0;
var score2 = 0;

var PAD_WIDTH = 16;
var PAD_HEIGHT = 80;
var paddle1_pos = 100;
var paddle2_pos = 100;
var paddle1_vel = 0;
var paddle2_vel = 0;

var ball_radius = 14;
var ball_pos = [300, 200];
var ball_vel = [0, 0];

//Helper Functions
var spawn_ball = function(direction) {
	//Respawns the ball toward the upper right or left corners
	//with random velocity
	ball_pos = [(WIDTH / 2), (HEIGHT / 2)];
	if (direction) {
		ball_vel[0] = (Math.random() * 4) + 3;
		ball_vel[1] = (Math.random() * 4) + 2; 
	} else {
		ball_vel[0] = (Math.random() * -4) + 3;
		ball_vel[1] = (Math.random() * -4) + 2; 
	}
}

var new_game = function() {
	//Resets the score, paddle positions, velocity
	//Respawns ball to the upper right
	paddle1_pos = 160;
	paddle2_pos = 160; 
	paddle1_vel = 0;
	paddle2_vel = 0;
	score1 = 0;
	score2 = 0;
	spawn_ball(RIGHT);
}

var draw = function() {
	//Updates the balls position
	ball_pos[0] += ball_vel[0];
	ball_pos[1] += ball_vel[1];

	//Responds to collisions
	if (((HEIGHT - 1 - ball_radius) < ball_pos[1]) || ball_pos[1] < ball_radius) {
		//Top and bottom collisions
		ball_vel[1] = (ball_vel[1] * -1);
	} else if ((WIDTH - PAD_WIDTH - ball_radius) <= ball_pos[0]) {
		//Meets right hand side
		if (((paddle2_pos - ball_radius) < ball_pos[1]) && (ball_pos[1] < (paddle2_pos + PAD_HEIGHT + ball_radius))) {
			//Hits right hand paddle
			ball_vel[0] = (ball_vel[0] * -1.1);
		} else {
			score1 += 1;
			spawn_ball(LEFT);
		}
	} else if (ball_pos[0] <= (ball_radius + PAD_WIDTH)) {
		//Meets left hand side
		if (((paddle1_pos - ball_radius) <= ball_pos[1]) && (ball_pos[1] <= (paddle1_pos + PAD_HEIGHT + ball_radius))) {
			//Hits left hand paddle
			ball_vel[0] = (ball_vel[0] * -1.1);
		} else {
			score2 += 1;
			spawn_ball(RIGHT);
		}
	}
	//Updates the paddle position, if the paddle will remain on the page
	if ((HEIGHT - PAD_HEIGHT - paddle1_vel >= paddle1_pos) && (paddle1_pos >= -1 * paddle1_vel)) {
	    paddle1_pos += paddle1_vel; 
	}
	if ((HEIGHT - PAD_HEIGHT - paddle2_vel >= paddle2_pos) && (paddle2_pos >= -1 * paddle2_vel)) {
	    paddle2_pos += paddle2_vel;
	}
	//Clears the canvas
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	ctx.fillStyle = "#ffffff";
	ctx.strokeStyle = "#ffffff";

	//Draw the ball
	ctx.beginPath();
	ctx.arc(ball_pos[0], ball_pos[1], ball_radius, 0, 2*Math.PI);
	ctx.fill();

	//Draws mid line and gutters
	ctx.moveTo((WIDTH / 2), 0);
	ctx.lineTo((WIDTH / 2), HEIGHT);
	ctx.stroke();
	ctx.moveTo(PAD_WIDTH, 0);
	ctx.lineTo(PAD_WIDTH, HEIGHT);
	ctx.stroke();
	ctx.moveTo((WIDTH - PAD_WIDTH), 0);
	ctx.lineTo((WIDTH - PAD_WIDTH), HEIGHT);
	ctx.stroke();

	//Draw the paddles
	ctx.fillRect(0, paddle1_pos, (PAD_WIDTH), PAD_HEIGHT);
	ctx.fillRect((WIDTH - PAD_WIDTH), paddle2_pos, PAD_WIDTH, PAD_HEIGHT);

    //Draw the scores
	ctx.font = "24px Arial";
	ctx.fillText(String(score1), 150, 40);
	ctx.fillText(String(score2), 450, 40);
}

var restart = function() {
	//Button handler to restart the game
	new_game();
	clearInterval(play);
	play = setInterval(draw, 60);
}
var keydown = function(e) {
	//Sets the paddle velocity based on the key pressed
    if (e.keyCode == '87') {
    	paddle1_vel = -8; //W
    } else if (e.keyCode == '83') {
    	paddle1_vel = 8; //S
    } else if (e.keyCode == '38') {
        paddle2_vel = -8; //UP
    } else if (e.keyCode == '40') {
    	paddle2_vel = 8; //DOWN
    }
}
var keyup = function(e) {
	//Sets the paddle velocity to zero if the right key is released
	e = e || window.event; 
    if (e.keyCode == '87' || e.keyCode == '83') {
    	paddle1_vel = 0; //W
    } 
    if (e.keyCode == '38' || e.keyCode == '40') {
    	paddle2_vel = 0;
    }
}

window.onload = function() {
	var theCanvas = document.getElementById('Canvas');
	if (theCanvas && theCanvas.getContext) {
		ctx = theCanvas.getContext("2d");
		if (ctx) {
			//Set Event handlers
			var restartButton = document.getElementById('restart')
			restartButton.onclick = function() {
				restart();
			}
			var pauseButton = document.getElementById('pause');
			pauseButton.onclick = function() {
				clearInterval(play);
			}
			var playButton = document.getElementById('play');
			playButton.onclick = function() {
				play = setInterval(draw, 60);
			}

			document.onkeydown = keydown;
			document.onkeyup = keyup;
			//Start the game
			new_game();
			play = setInterval(draw, 60);
            
		}
	}
};
















