"use strict";

class Background{

	constructor(){
		this._pic = Images.get('Green Felt.jpg');
	}

	doOnAdd(){
		this.world.addEventListener(this,'drawScreen',this.drawScreen,this.world.priorities['Background']);

		this.world.registerName('Background',this);

		let world = this.world;
		this._pic.onload = function(){
			world.worldView.redraw();
		};
	}

	drawScreen(ctx){
		let camera = this.world.camera;
		ctx.drawImage(this._pic, 0, 0,this.world.camera.screenWidth,this.world.camera.screenHeight);

		ctx.strokeStyle = "black";
		ctx.lineWidth = 3;
		//up stacks
		for(let i=0;i<4;i++){
			ctx.strokeRect(GameDisplayObject.upStackXs[i], GameDisplayObject.upStackY, CardObject.cardWidth, CardObject.cardHeight);
		}

		//hand
		ctx.strokeRect(GameDisplayObject.handTurnedX, GameDisplayObject.handY, CardObject.cardWidth, CardObject.cardHeight);
	}

	toString(){
		return 'Background';
	}
}