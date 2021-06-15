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

	constructor(card,x,y,priority = 0){//(x,y) is top left of card  priority 0 for cards on the felt
		this.card = card;
		this.x = x;
		this.y = y;
		this.priority = priority;
	}

	doOnAdd(){
		this.world.addEventListener(this,'drawScreen',this.drawScreen,this.world.priorities['CardObject']);
	}

	drawScreen(ctx){
		if(this.card.faceUp){
			CardObject.drawFront(this.x,this.y,this.card.value,this.card.suitId,ctx);
			// ctx.drawImage(CardObject.frontSheet, (this.card.value-1)*CardObject.imageCardWidth,(this.card.suitId)*CardObject.imageCardHeight,CardObject.imageCardWidth,CardObject.imageCardHeight,this.x,this.y,this.width,this.height);
		}else{//faceDown
			CardObject.drawBack(this.x,this.y,ctx);
			// ctx.drawImage(CardObject.backPic, this.x,this.y,this.width,this.height);
		}
	}

	static drawFront(x,y,value,suitId,ctx){
		ctx.drawImage(CardObject.frontSheet, (value-1)*CardObject.imageCardWidth,(suitId)*CardObject.imageCardHeight,CardObject.imageCardWidth,CardObject.imageCardHeight,x,y,CardObject.cardWidth,CardObject.cardHeight);
	}
	static drawBack(x,y,ctx){
		ctx.drawImage(CardObject.backPic,x,y,CardObject.cardWidth,CardObject.cardHeight);
	}

	setPriority(priority){
		this.priority = priority;
		this.world.changePriority(this,drawScreen,drawScreen,this.priority);
	}

	toString(){
		return 'CardObject: ' + this.card.toString();
	}
}