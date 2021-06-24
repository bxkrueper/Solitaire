"use strict";
//acts as the i/o to the game logic
class AI1{
	constructor(gameLogic){
		this.gameLogic = gameLogic;
		this.movesInLastHandReset = 1;//set to a non-zero value initially
	}

	reset(){
		this.movesInLastHandReset = 1;//set to a non-zero value initially
	}

	//GameDisplayObject will call this to tell the AI about any tampering with its game
	//allows alternating between manual play and AI
	manualMoveMade(){
		this.movesInLastHandReset++;
	}

	//this is the AI's main method. Calling this once should result in one move
	//returns null normally, but returns 'l' if it realized it lost
	advance(){
		let unrevealedStackIndex = this.gameLogic.getUnrevealedStackIndex();
		if(unrevealedStackIndex>=0){
			this.gameLogic.reveal(unrevealedStackIndex);
			return;
		}

		if(this._tryNoRiskPutUp()){
			return;
		}

		let move = this.gameLogic.checkStackToStack();
		if(move!=null){
			this.gameLogic.moveFromStackToStack(move.from,0,move.to);
			return;
		}

		move = this.gameLogic.checkHandCardToMain();
		if(move!=null){
			this.gameLogic.moveFromHandToMain(move.to);
			return;
		}

		move = this.gameLogic.checkStackToUp();
		if(move!=null){
			this.gameLogic.moveFromStackToUp(move.from,move.to);
			return;
		}

		move = this.gameLogic.checkHandCardToUp();
		if(move!=null){
			this.gameLogic.moveFromHandToUp(move.to);
			return;
		}



		let movesInThisHandReset = this.gameLogic.getActionsSinceHandReset();
		let handReset = this.gameLogic.turnHand();//turn hand and record if it reset
		if(handReset){
			if(this.movesInLastHandReset===0 && movesInThisHandReset===0){
				return 'l';//lost
			}

			this.movesInLastHandReset = movesInThisHandReset;
		}
	}


	//returns true if it put something up
	_tryNoRiskPutUp(){
		const lowestValueToPutUp = this.gameLogic.getLowestUpValue()+2;
		
		//check hand
		let card = this.gameLogic.getHandCard();
		if(card!=null){
			if(card.value<=lowestValueToPutUp){
				let upIndex = this.gameLogic.cardCanGoUp(card);
				if(upIndex>=0){
					this.gameLogic.moveFromHandToUp(upIndex);
					return true;
				}
			}
		}

		//check main stacks
		for(let stackIndex=0;stackIndex<7;stackIndex++){
			let card = this.gameLogic.getTopCardOnMainStack(stackIndex);
			if(card==null)
				continue;

			if(card.value<=lowestValueToPutUp){
				let upIndex = this.gameLogic.cardCanGoUp(card);
				if(upIndex>=0){
					this.gameLogic.moveFromStackToUp(stackIndex,upIndex);
					return true;
				}
			}
		}

		return false;
	}
}