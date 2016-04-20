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