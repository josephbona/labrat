"use srtict";

function Rat() {
	this.x = null;
	this.y = null;
	this.orientation = null;
	this.maze = null;
}

Rat.prototype.setMaze = function(maze) {
	this.maze = maze;
	this.x = maze.startX;
	this.y = maze.startY;
	this.orientation = maze.startOrientation;
}

Rat.prototype.turnRight = function() {
	if(!this.maze || !this.maze.isValidDirection(this.orientation)) {
		return false;
	}
	var rights = {
		north: "east",
		east: "south",
		south: "west",
		west: "north"
	}
	this.orientation = rights[this.orientation];
	return true;
}

Rat.prototype.turnLeft = function() {
	if(!this.maze || !this.maze.isValidDirection(this.orientation)) {
		return false;
	}
	var lefts = {
		north: "west",
		east: "north",
		south: "east",
		west: "south"
	}
	this.orientation = lefts[this.orientation];
	return true;
}

Rat.prototype.moveForward = function() {

	if(!this.canMoveForward()) {
		return false;
	}

	switch (this.orientation) {
		case "north":
			this.y += 1;
			break;
		case "east":
			this.x += 1;
			break;
		case "south":
			this.y -= 1;
			break;
		case "west":
			this.x -= 1;
			break;
	}

	return true;
}

Rat.prototype.canMoveForward = function() {
	if(!this.maze) {
		return false;
	}
	return this.maze.canMove(this.x, this.y, this.orientation);
};

Rat.prototype.exitMaze = function(steps) {
	if(this.maze) {
		while(steps != 0 && (this.x !== this.maze.endX || this.y != this.maze.endY)) {
			steps -= 1;
			if(this.canMoveForward()) {
				this.moveForward();
				this.turnLeft();
			} else {
				this.turnRight();
			}
		}
	}
};