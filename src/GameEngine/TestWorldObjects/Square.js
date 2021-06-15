"use strict";

class Square{

	constructor(x,y,colorString,priority = 0){
		this._x = x;//lowest value
		this._y = y;//lowest value
		this.colorString = colorString;
		this._size = 1;
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
			this.containsPoint);
		this._dragManager.addDragLogic();

		this.world.addEventListener(this,'drawWorld',this.drawWorld,this.priority);
		this.world.addEventListener(this,'mouseClicked',this.mouseClicked);
		this.world.addEventListener(this,'mouseDoubleClicked',this.mouseDoubleClicked);
		this.world.addEventListener(this,'keyDown',this.keyDown);
		this.world.addEventListener(this,'stringInput',this.stringInput);
		this.world.addEventListener(this,'mouseButtonDown',this.mouseButtonDown);
		// this.addEventListener('gameTick',this.gameTick);
	}

	drawWorld(ctx){
		if(this.world.currentTarget == this || this._dragging){
			ctx.fillStyle = '#00FF00';
		}else{
			ctx.fillStyle = this.colorString;
		}

		if(this._dragManager.dragging){
			ctx.fillRect(this._x-.15,this._y-.15,this._size+.3,this._size+.3);
		}else{
			// ctx.fillRect(this._x,this._y,this._size,this._size);
			Images.draw(Images.get("test.png"),this._x,this._y,this._size,this._size,ctx,this.world.camera);
			// ctx.drawImage(Images.get("test.png"),this._x,this._y,this._size,this._size);
		}
		
		
		

		// ctx.lineWidth = 2*this.world.worldView.camera.unitsPerPixelX;
		// // ctx.beginPath();              
		// ctx.moveTo(0, 0);
		// ctx.lineTo(1, 1);
		// // ctx.stroke();

		// ctx.moveTo(2, 2);
		// ctx.lineTo(3, 3);
		// ctx.stroke();
	}


	mouseButtonDown(buttonType){
		if(buttonType=='left' && this.world.currentTarget==this){
			// Sounds.getSound("Navi Fly.mp3").play();
			// this.addToWorld(new Square(this._x+1,this._y,this.colorString));/////////////
			// this.addToWorld(new Square(this._x-1,this._y,this.colorString));/////adds before iterator is done
			// this._dragManager.addDragLogic();
			// console.log('deleteDragLogic');
		}
		if(buttonType=='right' && this.world.currentTarget==this){
		}
	}

	mouseClicked(buttonType){
		if(buttonType=='right' && this.world.currentTarget == this){
			///////move to front:  keep drawWorld and Accept mouse target together
			this.world.changePriority(this,'drawWorld',this.drawWorld,this.priority);
			this.world.changePriority(this,'acceptMouseTarget',this._dragManager.get_acceptMouseTarget(),this.priority);

			var sound = Sounds.get("Navi Fly.mp3");
			sound.play();
		}
		
	}

	mouseDoubleClicked(buttonType){
		console.log("square double clicked!!!!!");
		
	}
		


	keyDown(keyValue){
		// if(keyValue=='f'){
		// 	this.world.changePriority(this,'drawWorld',this.drawWorld,this.priority);
		// }
		// if(keyValue=='b'){
		// 	this.world.pauseTimer("gameTick");
		// }
	}

	stringInput(string){
		// console.log('square accepted ' + string);
	}

	toString(){
		return "square " + this.colorString;
	}

	gameTick(){
		console.log("gameTick from Square");
		this._x += .1;
	}

	containsPoint(xMouse,yMouse){
		return (xMouse>this._x && yMouse>this._y && xMouse<this._x+this._size && yMouse<this._y+this._size);
	}

}