"use strict";
//acts as the i/o to the game logic
class GameDisplayObject{

	static upStackXs = [500,650,800,950];
	static upStackY = 90;

	static mainStackXs = [100,250,400,550,700,850,1000];
	static mainStackY = 300;
	static mainStackYOffset;

	static handTurnedX = 100;
	static handY = 90;
	static handShowX = 250;

	constructor(gameLogic){
		this.gameLogic = gameLogic;
		this.ai = new AI1(gameLogic);
		this.losses = 0;
		this.wins = 0;
		//all adding and deleting of cards should update these which keep track of them
		this.handCardObjectStacks = [[],[],[],[],[],[],[]];//for each stack: index 0 is the bottom
		this.visableHandCardObject = null;

		this.upKeepManualPlayStuff = true;//turn false while games are being automated with AI for performance

		GameDisplayObject.mainStackYOffset = CardObject.cardHeight/6;//not sure about order of static declarations, so setting this here instead
	}

	doOnAdd(){
		this.world.addEventListener(this,'keyInput',this.keyInput);
		this.world.addEventListener(this,'drawScreen',this.drawScreen,this.world.priorities['FakeCards']);
		this.world.addEventListener(this,'mouseButtonDown',this.mouseButtonDown);

		this.world.registerName('GameDisplayObject',this);

		this.addAllCardObjects();
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
			if(this.gameLogic.isWinState()){
				this.wins++;
			}else{
				this.losses++;
			}
			this.reset();
			return;
		}
	}

	//for detecting if the hand has been clicked
	mouseButtonDown(buttonType){
		let mouseX = this.world.worldView.currentXScreen;
		let mouseY = this.world.worldView.currentYScreen;
		//check turn card;
		if(mouseX>GameDisplayObject.handTurnedX && mouseY>GameDisplayObject.handY && mouseX<GameDisplayObject.handTurnedX+CardObject.cardWidth && mouseY<GameDisplayObject.handY+CardObject.cardHeight){
			this.turnHand();
			return;
		}

		//check reveal card
		if(mouseY>GameDisplayObject.mainStackY && mouseY<GameDisplayObject.mainStackY+CardObject.cardHeight){
			let self=this;
			GameDisplayObject.mainStackXs.forEach(function(xValue,index){
				if(mouseX>xValue && mouseX<xValue+CardObject.cardWidth){
					//try reveal
					if(self.gameLogic.getMainStack(index).length===0 && self.gameLogic.getUnderMainStack(index).length!=0){
						console.log('!!!!!!!revealed ' + index);
						self.gameLogic.reveal(index);
						self.addMainCardObject(index,0);
					}
				}
			});
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
			// let yOffset = 0;
			// self.gameLogic.getMainStack(stackIndex).forEach(function(card,withinStackIndex){
			// 	CardObject.drawFront(xValue,GameDisplayObject.mainStackY+yOffset,card.value,card.suitId,ctx);
			// 	yOffset+=GameDisplayObject.mainStackYOffset;
			// });
		});
		//hand
		// let handCard = this.gameLogic.getHandCard();
		// if(handCard!=null){
		// 	CardObject.drawFront(GameDisplayObject.handShowX,GameDisplayObject.handY,handCard.value,handCard.suitId,ctx);
		// }
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

	// addMainCardObjects(){
	// 	//add cards in main stacks
	// 	for(let stackIndex = 0;stackIndex<7;stackIndex++){
	// 		this.addMainCardObject(stackIndex);
	// 	}
	// }

	//spawns a cardObject on top of the given main stack index. Used at the start of the game or when revealing a card
	addMainCardObject(stackIndex,withinStackIndex){
		let card = this.gameLogic.getMainStack(stackIndex)[withinStackIndex];
		let cardObject = new CardObject(card,GameDisplayObject.mainStackXs[stackIndex],GameDisplayObject.mainStackY+GameDisplayObject.mainStackYOffset*withinStackIndex,'main',stackIndex,withinStackIndex,this,withinStackIndex);
		this.world.add(cardObject);
		this.handCardObjectStacks[stackIndex].push(cardObject);
	}

	//rebuild this.handCardObjectStacks  and this.visableHandCardObject from the current gameLogic and 
	//add all of the needed CardObjects. Used if gameLogic got changed without updating them
	//assumes deleteAllCardObjects() was called before
	addAllCardObjects(){
		//hand
		let visableHandCard = this.gameLogic.getHandCard();
		if(visableHandCard!=null){
			let cardObject = new CardObject(visableHandCard,GameDisplayObject.handShowX,GameDisplayObject.handY,'hand',null,this.gameLogic.handIndex,this,40);
			this.world.add(cardObject);
			this.visableHandCardObject = cardObject;
		}

		//main
		let self = this;
		for(let stackIndex = 0;stackIndex<7;stackIndex++){
			this.gameLogic.getMainStack(stackIndex).forEach(function(card,withinStackIndex){
				self.addMainCardObject(stackIndex,withinStackIndex);
			});
		}
	}

	deleteAllCardObjects(){
		this.handCardObjectStacks.forEach(function(cardObjectStack){
			cardObjectStack.forEach(function(cardObject){
				cardObject.world.delete(cardObject);
			});
		});
		this.handCardObjectStacks = [[],[],[],[],[],[],[]];
		if(this.visableHandCardObject!=null){
			this.world.delete(this.visableHandCardObject);
			this.visableHandCardObject = null;
		}
	}

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
		
		//AI ignored all the cardObject maintaining that is happening here, so refresh it
		if(this.upKeepManualPlayStuff){
			this.deleteAllCardObjects();
			this.addAllCardObjects();
		}
		

		return false;
	}

	advanceToGameFinish(){
		this.upKeepManualPlayStuff = false;
		while(!this.advance()){//while loop does an entire game at a time
		}
		this.upKeepManualPlayStuff = true;
	}

	reset(){
		this.gameLogic.setup();
		this.ai.reset();
		this.deleteAllCardObjects();
		this.addAllCardObjects();
	}

	cardPickedUp(cardObject){
		if(cardObject.gamePosition==='hand'){
			return;
		}
		let movingCardObjects = this.handCardObjectStacks[cardObject.stackIndex].slice(cardObject.withinStackIndex);
		movingCardObjects.forEach(function(cardObject,index){
			cardObject.setPriority(cardObject.priority+20);//have them be higher than other cards while being caried
		});
	}

	cardDraged(cardObject){
		if(cardObject.gamePosition==='hand'){
			return;
		}
		let otherMovingCardObjects = this.handCardObjectStacks[cardObject.stackIndex].slice(cardObject.withinStackIndex+1);
		otherMovingCardObjects.forEach(function(movingCardObject,index){
			movingCardObject.x = cardObject.x;
			movingCardObject.y = cardObject.y+GameDisplayObject.mainStackYOffset*(movingCardObject.withinStackIndex-cardObject.withinStackIndex);
		});
	}

	cardDroped(cardObject,mouseX,mouseY){
		let from = cardObject.gamePosition;
		let fromIndex = cardObject.stackIndex;
		let fromWithinStackIndex = cardObject.withinStackIndex;

		//find where the card is trying to go (which gamePosition and index)
		let to;
		let toIndex;
		let cardMiddleX = cardObject.x+CardObject.cardWidth/2;
		let cardMiddleY = cardObject.y+CardObject.cardHeight/2;
		let yBetweenMainAndUp = (GameDisplayObject.mainStackY + GameDisplayObject.upStackY)/2;
		let cardAreaHeight=CardObject.cardHeight*1.5;//range to place the middle and have it count to a pile
		if(cardMiddleY<yBetweenMainAndUp && cardMiddleY>GameDisplayObject.upStackY-cardAreaHeight/3){
			let upCardAreaWidth=GameDisplayObject.upStackXs[1]-GameDisplayObject.upStackXs[0];//assumes they are all evenly spaced
			let validStartX=GameDisplayObject.upStackXs[0]+CardObject.cardWidth/2-upCardAreaWidth/2;
			toIndex = Math.floor((cardMiddleX-validStartX)/upCardAreaWidth);
			if(toIndex>=0 && toIndex<=3){
				to = 'up';
			}
			
		}else if(cardMiddleY>yBetweenMainAndUp && cardMiddleY<GameDisplayObject.mainStackY+cardAreaHeight*2){//how far for biggest stack?
			let mainCardAreaWidth=GameDisplayObject.mainStackXs[1]-GameDisplayObject.mainStackXs[0];//assumes they are all evenly spaced
			let validStartX=GameDisplayObject.mainStackXs[0]+CardObject.cardWidth/2-mainCardAreaWidth/2;
			toIndex = Math.floor((cardMiddleX-validStartX)/mainCardAreaWidth);
			if(toIndex>=0 && toIndex<=6){
				to = 'main';
			}
		}

		//apply the move if it is legal
		if(to==null){
			//return card
			console.log('no placement');
			this._resetCardFromDrag(cardObject);
		}else{
			console.log('checking from ' + from + ' ' + fromIndex + ' to ' + to + " " + toIndex);
			if(this.gameLogic.checkMove(from,fromIndex,fromWithinStackIndex,to,toIndex)){
				console.log(true);
				this.applyMove(from,fromIndex,fromWithinStackIndex,to,toIndex);
			}else{
				console.log('false');
				this._resetCardFromDrag(cardObject);
			}
		}
	}

		_resetCardFromDrag(cardObject){
			if(cardObject.gamePosition==='hand'){
				cardObject.goHome();
				cardObject.setPriority(40);//reset pritority to normal for hand
			}else{//it is from main
				let movingCardObjects = this.handCardObjectStacks[cardObject.stackIndex].slice(cardObject.withinStackIndex);//copies everything from that to the end
				movingCardObjects.forEach(function(movingCardObject){
					movingCardObject.goHome();
					movingCardObject.setPriority();//reset pritority to normal
				});
			}
		}

	applyMove(fromPosition,fromIndex,fromWithinStackIndex,toPosition,toIndex){
		let self = this;
		let toWithinStackIndexStart;
		//deal with adding and moving card objects

		//deal with from
		let movingCardObjects;
		if(fromPosition==='hand'){
			movingCardObjects = [this.visableHandCardObject];
			this.visableHandCardObject = null;

			let visableHandCard=this.gameLogic.getCardBehindHandCard();
			if(visableHandCard!=null){
				let cardObject = new CardObject(visableHandCard,GameDisplayObject.handShowX,GameDisplayObject.handY,'hand',null,this.gameLogic.handIndex-1,this,40);
				this.world.add(cardObject);
				this.visableHandCardObject = cardObject;
			}


		}else if(fromPosition==='main'){
			movingCardObjects = this.handCardObjectStacks[fromIndex].slice(fromWithinStackIndex);//copies everything from that to the end
			this.handCardObjectStacks[fromIndex].splice(fromWithinStackIndex,20);//that card object and everything after it gets removed from the list
		}

		//deal with to
		//set positions
		movingCardObjects.forEach(function(cardObject,index){
			cardObject.gamePosition = toPosition;
		});

		if(toPosition==='main'){
			toWithinStackIndexStart = this.gameLogic.getMainStack(toIndex).length;
			movingCardObjects.forEach(function(cardObject,index){
				cardObject.withinStackIndex = toWithinStackIndexStart+index;
				cardObject.x = GameDisplayObject.mainStackXs[toIndex];
				cardObject.y = GameDisplayObject.mainStackY+GameDisplayObject.mainStackYOffset*(cardObject.withinStackIndex);
				cardObject.updateHome();
				cardObject.stackIndex = toIndex;
				cardObject.setPriority();
				self.handCardObjectStacks[toIndex].push(cardObject);
			});
		}else if(toPosition==='up'){
			this.world.delete(movingCardObjects[0]);//there should only be one card if moving up
		}

		//update game logic
		this.gameLogic.applyMove(fromPosition,fromIndex,fromWithinStackIndex,toPosition,toIndex);

		this.ai.manualMoveMade();//inform ai so it doesn't end the game early if activated thinking it tried everything
	}

	turnHand(){
		if(this.visableHandCardObject!=null){
			this.world.delete(this.visableHandCardObject);
			this.visableHandCardObject = null;
		}
		this.gameLogic.turnHand();
		let visableCard = this.gameLogic.getHandCard();
		if(visableCard!=null){
			let cardObject = new CardObject(visableCard,GameDisplayObject.handShowX,GameDisplayObject.handY,'hand',null,this.gameLogic.handIndex,this,40);
			this.world.add(cardObject);
			this.visableHandCardObject = cardObject;
		}
	}

	toString(){
		return 'GameDisplayObject';
	}
}