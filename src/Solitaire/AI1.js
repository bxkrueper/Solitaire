"use strict";
//acts as the i/o to the game logic
class AI1{
	constructor(gameLogic){
		this.gameLogic = gameLogic;
		this.stackIdToReveal = -1;//reminder to prioritize revealing the stack on the next turn
		this.movesInLastHandReset = 1;//set to a non-zero value initially
	}

	reset(){
		this.stackIdToReveal = -1;
		this.movesInLastHandReset = 1;//set to a non-zero value initially
	}

	//returns true if it put something up
	tryNoRiskPutUp(){
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
					if(this.gameLogic.getUnderMainStack(stackIndex).length>0){
						this.stackIdToReveal = stackIndex;
					}
					return true;
				}
			}
		}

		return false;
	}

	//returns null normally, but returns 'l' if it realized it lost
	advance(){
		if(this.stackIdToReveal>=0){
			this.gameLogic.reveal(this.stackIdToReveal);
			this.stackIdToReveal = -1;
			return;
		}

		if(this.tryNoRiskPutUp()){
			return;
		}

		let move = this.gameLogic.checkStackToStack();
		if(move!=null){
			this.gameLogic.moveFromStackToStack(move.from,move.to);
			if(this.gameLogic.getUnderMainStack(move.from).length>0){
				this.stackIdToReveal = move.from;
			}
			return;
		}

		move = this.gameLogic.checkHandCardToStack();
		if(move!=null){
			this.gameLogic.moveFromHandToStack(move.to);
			return;
		}

		move = this.gameLogic.checkStackToUp();
		if(move!=null){
			this.gameLogic.moveFromStackToUp(move.from,move.to);
			if(this.gameLogic.getMainStack(move.from).length===0 && this.gameLogic.getUnderMainStack(move.from).length>0){
				this.stackIdToReveal = move.from;
			}
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
}