"use strict";

class CardObject{

	static cardRatio = 3.5/2.5;//height/width
	static cardWidth = 90;
	static cardHeight = CardObject.cardWidth*CardObject.cardRatio

	//picture info
	static imageCardWidth = 225;//in pixles
	static imageCardHeight = 315;//in pixles
	static frontSheet = Images.get('Cards/sheet.png');//sprite sheet of all fronts of cards
	static backPic = Images.get('Cards/back.png');//just the back of the card

	constructor(card,x,y,gamePosition,stackIndex,withinStackIndex,gameDisplayObject,priority = 0){//(x,y) is top left of card  priority 0 for cards on the felt
		this.card = card;
		this.x = x;
		this.y = y;
		this.gamePosition = gamePosition;
		this.stackIndex = stackIndex;
		this.withinStackIndex = withinStackIndex;//0 is bottom of stack
		this.gameDisplayObject = gameDisplayObject;
		this.priority = priority;

		this.homeX = x;
		this.homeY = y;
	}

	doOnAdd(){
		this.world.addEventListener(this,'drawScreen',this.drawScreen,this.priority);
		this._dragManager = new DragManager('left',this,'x','y',this.containsPoint,'screen',this.doOnPickedUpFunction,this.doOnDragedFunction,this.doOnDropedFunction);
		this._dragManager.addDragLogic(this.priority);
	}

	drawScreen(ctx){
		if(this.card.faceUp){
			CardObject.drawFront(this.x,this.y,this.card.value,this.card.suitId,ctx);
		}else{//faceDown
			CardObject.drawBack(this.x,this.y,ctx);
		}
	}

	static drawFront(x,y,value,suitId,ctx){
		ctx.drawImage(CardObject.frontSheet, (value-1)*CardObject.imageCardWidth,(suitId)*CardObject.imageCardHeight,CardObject.imageCardWidth,CardObject.imageCardHeight,x,y,CardObject.cardWidth,CardObject.cardHeight);
	}
	static drawBack(x,y,ctx){
		ctx.drawImage(CardObject.backPic,x,y,CardObject.cardWidth,CardObject.cardHeight);
	}

	setPriority(priority = this.withinStackIndex){
		this.priority = priority;
		this.world.changePriority(this,'drawScreen',this.drawScreen,this.priority);
		this._dragManager.changeTargetDetectPriority(this.priority);
	}

	containsPoint(x,y){
		return x>=this.x && y>=this.y && x<this.x+CardObject.cardWidth && y<this.y+CardObject.cardHeight;
	}

	updateHome(){
		this.homeX=this.x;
		this.homeY=this.y;
	}
	goHome(){
		this.x=this.homeX;
		this.y=this.homeY;
	}

	doOnPickedUpFunction(){
		this.gameDisplayObject.cardPickedUp(this);
	}
	doOnDragedFunction(){
		console.log('card draged' + this.x);
		this.gameDisplayObject.cardDraged(this);
	}
	doOnDropedFunction(){
		console.log('card droped');
		this.gameDisplayObject.cardDroped(this,this.world.worldView.currentXScreen,this.world.worldView.currentYScreen);
	}

	toString(){
		return 'CardObject: ' + this.card.toString();
	}
}