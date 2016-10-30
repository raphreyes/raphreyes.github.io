// Enemies our player must avoid
var Enemy = function(laneNumber) {
	// Start enemies at left completely off the game field
	// Start enemy on random x value up to 4 enemy widths off-screen
	this.x = (Math.random() * 404) * -1;
	// Assign the enemy lane and speed
	// Top lane (#3) enemies move faster
	this.lane = laneNumber;
	if(this.lane == 1) {
		this.y = 228;
		this.speed = 1;
	} else {
		if(this.lane == 2) {
			this.y = 145;
			this.speed = 2;
		} else {
			this.y = 60;
			this.speed = 3;
		}
	}
	// The image/sprite for our enemies, this uses
	// a helper we've provided to easily load images
	this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
	var rightEdgeScreen = 505;
	this.x = ((this.x + (this.speed*(dt*100))));
	// console.log(this.speed*(dt*100));
	// if the enemy moves off right edge,
	// move them back to left side
	if(this.x > rightEdgeScreen) {
		// Move the enemy back to a random distance beyond left edge of board
		this.x = (Math.random() * 404) * -1;
	}
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
	this.x = 200;
	this.y = 400;
	this.sprite = 'images/char-boy.png';
	this.score = 0;
};

Player.prototype.update = function() {
	// Check for goal and reset player
	if (this.y == -10) {
		this.reset();
	}

	// adjust score for win and knockbacks
	if (this.y == 400 && this.condition == 'win') {
		this.condition = 'normal';
		doScore('goal');
	}
	// set player graphic to fallen if state is collision
	if (this.condition == 'ouch') {
		this.condition = 'pain';
	}

	// check lane1 enemy with cushion of 60 pixels in front and 40 in back
	if (this.y == 236) {
		if (allEnemies[0].x >= this.x - 40 && allEnemies[0].x <= this.x + 60) {
			this.tradgedy();
		}
	}
	// check lane2 enemy with cushion of 60 pixels in front and 40 in back
	if (this.y == 154) {
		if (allEnemies[1].x >= this.x - 40 && allEnemies[1].x <= this.x + 60) {
			this.tradgedy();
		}
	}
	// check lane3 enemy with cushion of 60 pixels in front and 40 in back
	if (this.y == 72) {
		if (allEnemies[2].x >= this.x - 40 && allEnemies[2].x <= this.x + 60) {
			this.tradgedy();
		}
	}
};

Player.prototype.handleInput = function(input) {
	// if player is in pain, the next move they will stand up
	// within same square and return to normal color
	if (input !== null && this.condition == 'pain' ) {
		this.condition = 'normal';
		return;
	}

	// Set player's condition to normal
	this.condition = 'normal';

	// prevent moving x in goal lane and lock the win column value
	if (input == 'right' && this.y == -10) {
		this.wincol = this.x;
		return;
	}
	if (input == 'left' && this.y == -10) {
		this.wincol = this.x;
		return;
	}
	// move player up unless they are at the top
	if (input == 'up' && this.y > -10) {
		this.y = this.y - 82;
		this.wincol = this.x;
	}
	// move player down unless they are at the bottom
	if (input == 'down' && this.y < 400) {
		this.y = this.y + 82;
		this.wincol = this.x;
	}
	// move player left unless they are at the left edge
	if (input == 'left' && this.x > -2) {
		this.x = this.x - 101;
		this.wincol = this.x;
	}
	// move player right unless they are at the right edge
	if (input == 'right' && this.x < 402) {
		this.x = this.x + 101;
		this.wincol = this.x;
	}
	// console.log(this.x, this.y);
};

Player.prototype.render = function() {
	// if player collides with enemy
	if (this.condition == 'ouch') {
			this.sprite = 'images/char-boy-l45.png';
	}
	if (this.condition == 'pain') {
			this.sprite = 'images/char-boy-r45.png';
	}

	// Player turns gold on win
	if (this.condition == 'win') {
			this.sprite = 'images/char-boy-gold.png';
	}
	if (this.condition == 'normal') {
		this.sprite = 'images/char-boy.png';
	}
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.tradgedy = function() {
	// knock player down if there is collision
	var penalty =  this.y + 82;
	this.y =  penalty;
	this.condition = 'ouch';
	doScore('ouch');
};


// Player reaches top, pause, then reset to botom
Player.prototype.reset = function() {
	this.condition = 'win';
	setTimeout(function() {
		this.y = 400;
	}.bind(this), 1000);
};

var doScore = function(type) {
	if (type == 'goal') {
		// add the base score
		player.score =  player.score + 50;
		// adjust score depending on the win column
		// left edge scores highest, right edge scores lower
		if (player.wincol == -2) {
			player.score = player.score + 15;
		}
		if (player.wincol == 99) {
			player.score = player.score + 5;
		}
		if (player.wincol == 301) {
			player.score = player.score -15;
		}
		if (player.wincol == 402) {
			player.score = player.score -40;
		}

		// console.log(player.x, player.wincol);
	}
	if (type == 'ouch') {
		player.score =  player.score - 15;
		this.condition = 'pain';
	}
	if (type == 'pain') {
		return;
	}
	document.getElementById('Score').innerHTML='<div>SCORE:'+player.score+'</div>';
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();

// Create enemy with lane number 1-3
var allEnemies = Array();
for (var i = 1, enemies = 3; i <= enemies; i++) {
	allEnemies.push(new Enemy(i));
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
	var allowedKeys = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};

	player.handleInput(allowedKeys[e.keyCode]);
});
