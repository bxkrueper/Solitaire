"use strict";
//acts as the i/o to the game logic
class GameDisplayObject{

	static upStackXs = [240,440,640,840];
	static upStackY = 90;

	static mainStackXs = [100,250,400,550,700,850,1000];
	static mainStackY = 300;
	static mainStackYOffset = 20;

	static handTurnedX = 450;
	static handY = 700;
	static handShowX = 600;

	constructor(gameLogic){
		this.gameLogic = gameLogic;
		this.ai = new AI1(gameLogic);
		this.losses = 0;
		this.wins = 0;
	}

	doOnAdd(){
		this.world.addEventListener(this,'keyInput',this.keyInput);
		this.world.addEventListener(this,'drawScreen',this.drawScreen,this.world.priorities['FakeCards']);

		this.world.registerName('GameDisplayObject',this);

		// this.addCardObjects();
	}

	keyInput(keyName){
		if(keyName==='right'){

			this.advance();
			
			return;
		}

		if(keyName==='space'){

			this.advanceToGameFinish();
			
			return;
		}

		if(keyName==='enter'){
			this.reset();
			return;
		}
	}



	drawScreen(ctx){
		this.drawFakeStacks(ctx);
		this.drawCards(ctx);
		this.drawWinsLosses(ctx);
	}

	drawWinsLosses(ctx){
		ctx.font = "20px Georgia";
		ctx.fillStyle = 'black';
		ctx.fillText("Wins: " + this.wins, 10, 30);
		ctx.fillText("Losses: " + this.losses, 10, 55);
	}

	drawCards(ctx){
		let self = this;
		//up stacks
		GameDisplayObject.upStackXs.forEach(function(xValue,index){
			let upStack = self.gameLogic.getUpStack(index);
			let topCard = upStack[upStack.length-1];
			if(topCard!=null){
				CardObject.drawFront(xValue,GameDisplayObject.upStackY,topCard.value,topCard.suitId,ctx)
			}
		});
		//main stacks
		GameDisplayObject.mainStackXs.forEach(function(xValue,stackIndex){
			let yOffset = 0;
			self.gameLogic.getMainStack(stackIndex).forEach(function(card,withinStackIndex){
				CardObject.drawFront(xValue,GameDisplayObject.mainStackY+yOffset,card.value,card.suitId,ctx);
				yOffset+=GameDisplayObject.mainStackYOffset;
			});
		});
		//hand
		let handCard = this.gameLogic.getHandCard();
		if(handCard!=null){
			CardObject.drawFront(GameDisplayObject.handShowX,GameDisplayObject.handY,handCard.value,handCard.suitId,ctx);
		}
	}

	//draw fake cards to show depth
	drawFakeStacks(ctx){
		let self = this;
		//up stacks
		GameDisplayObject.upStackXs.forEach(function(xValue,index){
			let upStack = self.gameLogic.getUpStack(index);
			let secondFromTopCard = upStack[upStack.length-2];
			if(secondFromTopCard!=null){
				self.drawFakeStackFront(xValue,GameDisplayObject.upStackY,secondFromTopCard.value,secondFromTopCard.suitId,self.gameLogic.getUpStack(index).length-1,1,ctx);
			}
		});
		//main stacks
		GameDisplayObject.mainStackXs.forEach(function(xValue,index){
			self.drawFakeStackBack(xValue,GameDisplayObject.mainStackY,self.gameLogic.getUnderMainStack(index).length,3,ctx);
		});
		//hand
		this.drawFakeStackBack(GameDisplayObject.handTurnedX,GameDisplayObject.handY,this.gameLogic.getCardsInHandFaceDown(),1,ctx);
		let behindShowingHandCard = this.gameLogic.getCardBehindHandCard();
		if(behindShowingHandCard!=null){
			//draw copies of the card behind the front card. Don't need to draw the cards behind that accuratly because we will only see the edges
			this.drawFakeStackFront(GameDisplayObject.handShowX,GameDisplayObject.handY,behindShowingHandCard.value,behindShowingHandCard.suitId,this.gameLogic.getCardsInHandFaceUp()-1,2,ctx);
		}
		
	}
	//x,y: coords of top card (not drawn here)
	drawFakeStackFront(x,y,value,suitId,cardsToDraw,offsetForEach,ctx){
		
		for(let count = cardsToDraw;count>=1;count--){
			CardObject.drawFront(x-count*offsetForEach,y-count*offsetForEach,value,suitId,ctx);
		}
	}
	//x,y: coords of top card (not drawn here)
	drawFakeStackBack(x,y,cardsToDraw,offsetForEach,ctx){
		
		for(let count = cardsToDraw;count>=1;count--){
			CardObject.drawBack(x-count*offsetForEach,y-count*offsetForEach,ctx);
		}
	}

	// addCardObjects(){
	// 	let self = this;
	// 	//don't need to add up cards - none atm

	// 	//add cards in main stacks
	// 	for(let stackIndex = 0;stackIndex<7;stackIndex++){
	// 		let stack = this.gameLogic.getMainStack(stackIndex);
	// 		stack.forEach(function(card,indexInStack){
	// 			let cardObject = new CardObject(card,GameDisplayObject.mainStackXs[stackIndex],GameDisplayObject.mainStackY,GameDisplayObject.cardWidth,indexInStack);
	// 			self.world.add(cardObject);
	// 		});
	// 	}

	// 	//add cards in hand
	// 	let hand = this.gameLogic.getHand();
	// 	hand.forEach(function(card,indexInStack){
	// 		let cardObject = new CardObject(card,GameDisplayObject.handTurnedX,GameDisplayObject.handY,GameDisplayObject.cardWidth,hand.length-1-indexInStack);
	// 		self.world.add(cardObject);
	// 	});
	// }

	//returns true if game ended and false if not
	advance(){
		if(this.gameLogic.isWinState()){
			this.wins++;
			this.reset();
			return true;
		}

		let advanceResult = this.ai.advance();

		if(advanceResult==='l'){//if it lost
			this.losses++;
			this.reset();
			return true;
		}
		
		return null;
	}

	advanceToGameFinish(){
		while(!this.advance()){//while loop does an entire game at a time

		}
	}

	reset(){
		this.gameLogic.setup();
		this.ai.reset();
	}

	toString(){
		return 'GameDisplayObject';
	}
}