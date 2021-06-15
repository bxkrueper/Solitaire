"use strict";

class FunctionPlotter{///////have graph plot this?

	constructor(expressionString){
		this._plottable = false;
		this._rootNode = null;
		this._compiledFunc = null;
		this.expressionString = expressionString;//calls setter
		this._lineThickness = 4;
		this._lineColor = 'blue';
	}

	set expressionString(expressionString){
		try{
			this._rootNode = math.simplify(math.parse(expressionString));
			this._plottable = true;
		}catch(err){
			this._rootNode = math.parse('1');/////////use undefined or something?
			this._plottable = false;
		}
		
		this._compiledFunc = this._rootNode.compile();
	}

	doOnAdd(){
		this.world.addEventListener(this,'drawWorld',this.drawWorld);
		this.world.addEventListener(this,'drawScreen',this.drawScreen);
	}

	drawWorld(ctx){
		if(!this._plottable){
			return;
		}
		let camera = this.world.camera;
		let leftWorld = camera.left;
		let rightWorld = camera.right;
		// const screenWidthPix = this.world.camera.screenWidth;
		let pixStep = camera.unitsPerPixelXPos;
		let scope = {x:leftWorld};

		ctx.lineWidth = this._lineThickness*camera.unitsPerPixelX;
		ctx.strokeStyle = this._lineColor;
		ctx.beginPath();              
		ctx.moveTo(leftWorld, this._compiledFunc.evaluate(scope));
		for(let i=leftWorld+pixStep;i<=rightWorld;i+=pixStep){
			scope.x = i;
			ctx.lineTo(i, this._compiledFunc.evaluate(scope));
		}
		ctx.stroke();
	}

	drawScreen(ctx){
		// ctx.font = 50 + 'px ' + "Arial";
		// ctx.fillStyle = "black";
		// let str = this._rootNode.toString({parenthesis: 'auto', implicit: 'hide'});
		// str = str.replace(/ /g,"");
		// ctx.fillText(str,10, 400);
	}


	

	toString(){
		return "FunctionPlotter " + this._rootNode.toString({parenthesis: 'auto'});
	}

}