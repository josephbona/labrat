function LabratMazeInterface(rat,maze,selector
  ) {
  this.rat = rat;
  this.maze  = maze;
  this.selector = selector;
}

LabratMazeInterface.prototype.canMove = function (x, y, direction) {
  var forwardX, forwardY, forwardDirection;

  if (["north","east","south","west"].indexOf(direction) === -1) {
    return false;
  }

  switch (direction) {
    case "north":
      forwardX = x;
      forwardY = y+1;
      forwardDirection = "south";
      break;
    case "east":
      forwardX = x+1;
      forwardY = y;
      forwardDirection = "west";
      break;
    case "south":
      forwardX = x;
      forwardY = y-1;
      forwardDirection = "north";
      break;
    case "west":
      forwardX = x-1;
      forwardY = y;
      forwardDirection = "east";
      break;
  }

  if (forwardX <= 0 || forwardX > this.maze.width || forwardY <= 0 || forwardY > this.maze.height) {
    return false
  }

  if (this.maze.spaces[x][y][direction]) {
    return false
  }

  if (this.maze.spaces[forwardX][forwardY][forwardDirection]) {
    return false
  }

  return true
}

LabratMazeInterface.prototype.render = function () {
  $(this.selector).empty().append(this.renderMaze(), this.renderControls());
};

LabratMazeInterface.prototype.renderMaze = function () {
  var $maze = $("<div class='maze'>");
  var $mazeRow, $mazeSpace;
  for (var y=this.maze.height; y >= 1; y -=1 ){
    $mazeRow = $('<div class="mazeRow">').appendTo($maze);
    for (var x=1; x <= this.maze.width; x +=1 ){
      $mazeSpace = $('<div class="mazeSpace">').appendTo($mazeRow);
      $mazeSpace.append(this.renderSpace(x,y));
      $mazeSpace.append("&nbsp;")
        .toggleClass('north', !this.canMove(x, y, 'north'))
        .toggleClass('south', !this.canMove(x, y, 'south'))
        .toggleClass('east', !this.canMove(x, y, 'east'))
        .toggleClass('west', !this.canMove(x, y, 'west'));
    }
  }
  return $maze;
}

LabratMazeInterface.prototype.renderSpace = function (x,y) {
  var isRat = false;
  var isStart = false;
  var isEnd = false;

  if (this.rat !== null && this.rat.x == x && this.rat.y == y) {
      isRat = true;
  }
  if (this.maze.endX == x && this.maze.endY == y) {
      isEnd = true;
  }
  if (this.maze.startX == x && this.maze.startY == y)  {
      isStart = true;
  }

  if (!isRat && !isStart && !isEnd) {
    return "";
  }

  var icons = {
    start: "icon-screenshot",
    end: "icon-remove-circle",
    northRat: "icon-arrow-up",
    eastRat: "icon-arrow-right",
    southRat: "icon-arrow-down",
    westRat: "icon-arrow-left",
    northRatStart: "icon-circle-arrow-up",
    eastRatStart: "icon-circle-arrow-right",
    southRatStart: "icon-circle-arrow-down",
    westRatStart: "icon-circle-arrow-left",
    ratEnd: "icon-ok-sign "
  }
  var $space = $('<i>');

  if (isRat) {
    $space.addClass("rat");
  }
  if (isStart) {
    $space.addClass("start");
  }
  if (isEnd) {
    $space.addClass("end");
  }

  if (isRat && isEnd) {
    $space.addClass(icons["ratEnd"]);
  } else if (isRat && isStart) {
    $space.addClass(icons[this.rat.orientation + "RatStart"]);
  } else if (isRat) {
    $space.addClass(icons[this.rat.orientation + "Rat"]);
  } else if (isEnd) {
    $space.addClass(icons["end"]);
  } else if (isStart)  {
    $space.addClass(icons["start"]);
  }

  return $space;

}

LabratMazeInterface.prototype.renderControls = function () {
  var interface = this;
  if (interface.rat === null) return false;
  var $actions = $("<div class='actions'>");


  var buttons = {};
  if(typeof interface.rat.turnLeft == 'function') {
    buttons["Turn Left"] = function () {
        interface.rat.turnLeft();
        interface.render();
      };
  }
  if(typeof interface.rat.turnRight == 'function') {
    buttons["Turn Right"] = function () {
        interface.rat.turnRight();
        interface.render();
      };
  }
  if(typeof interface.rat.moveForward == 'function') {
  buttons["Move Forward"] = function () {
      interface.rat.moveForward();
      interface.render();
    };
  }
  if(typeof interface.rat.canMoveForward == 'function') {
    buttons["Can Move Forward?"] = function () {
        if (interface.rat.canMoveForward()) {
            alert("Yes!");
        } else {
            alert ("No.");
        }
      };
  }
  if(typeof interface.rat.setMaze == 'function') {
    buttons["Place in Maze"] = function () {
        interface.rat.setMaze(interface.maze);
        interface.render();
      };
  }
  if(typeof interface.rat.exitMaze == 'function') {
    buttons["Exit Maze"] = function () {
        if (interface.rat.maze == interface.maze) {
          (function callExitMaze(){
              setTimeout(function() {
                  result = interface.rat.exitMaze(1);
                  interface.render();
                  if (result === false) {
                      callExitMaze();
                  }
                 return result;
              }, 300);
          })();
        }
      };
  }

  for (var label in buttons) {
    if (buttons.hasOwnProperty(label)){
      var $btn = $('<a class="btn">')
        .text(label)
        .appendTo($actions)
        .click(buttons[label]);
    }
  }

  if (this.rat.maze != this.maze) {
    $rat = $('<i class="rat icon-user"></i>').appendTo($actions);
  }

  return $actions;
}

