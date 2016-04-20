"use strict";

function Maze(width, height) {
	this.width = width;
	this.height = height;

	this.startX = null;
	this.startY = null;
	this.startOrientation = null;
	this.endX = null;
	this.endY = null;

	this.directions = ["north", "south", "east", "west"];
	this.spaces = [];

	var x, y;
	for ( x=1; x <= width; x++) {
		this.spaces[x] = [];
		for (y=1; y <= height; y++) {
			this.spaces[x][y] = new MazeSpace(this.directions);
		}
	}
}

Maze.prototype.setStart = function(x, y, orientation) {
	if(this.isValidDirection(orientation) && this.isInBounds(x,y)) {
		this.startX = x;
		this.startY = y;
		this.startOrientation = orientation;
		return true;
	}
	return false;
}

Maze.prototype.setEnd = function(x,y) {
	if(!this.isInBounds(x,y)) {
		return false;
	}
	this.endX = x;
	this.endY = y;
	return true;
}

Maze.prototype.setWall = function(x, y, direction) {
	if (this.isInBounds(x,y) && this.isValidDirection(direction)) {
		this.spaces[x][y].setWall(direction);
		return true;
	}
	return false;
}

Maze.prototype.isValidDirection = function(direction) {
	return this.directions.indexOf(direction) !== -1;
}

Maze.prototype.isInBounds = function(x,y) {
	return x > 0 && x <= this.width && y > 0 && y <= this.height;
}