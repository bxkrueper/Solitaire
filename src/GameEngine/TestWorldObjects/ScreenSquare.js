"use strict";

class ScreenSquare{

	constructor(x,y,colorString,priority = 0){
		this._x = x;
		this._y = y;
		this.colorString = colorString;
		this._size = 100;
		this.priority = priority;
	}

	doOnAdd(){
		this._dragManager = new DragManager('left',this,
			function(){
				return this._x;
			},
			function(){
				return this._y;
			},
			function(newX){
				this._x = newX;
			},
			function(newY){
				this._y = newY;
			},
			this.containsPoint,'screen');
		this._dragManager.addDragLogic();

		this.world.addEventListener(this,'drawScreen',this.drawScreen,this.priority);
	}

	drawScreen(ctx){
		ctx.fillStyle = this.colorString;
		ctx.fillRect(this._x,this._y,this._size,this._size);
	}

	toString(){
		return "Screen Square " + this.colorString;
	}



	containsPoint(xMouse,yMouse){
		return (xMouse>this._x && yMouse>this._y && xMouse<this._x+this._size && yMouse<this._y+this._size);
	}

}