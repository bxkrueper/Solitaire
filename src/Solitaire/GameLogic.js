
class GameLogic{

	constructor(){
		this.setup();
	}

	getUpStack(index){
		return this._upStacks[index];
	}
	getMainStack(index){
		return this._mainStacks[index];
	}
	getUnderMainStack(index){
		return this._underMainStacks[index];
	}
	getTopCardOnMainStack(index){
		let stack = this._mainStacks[index];
		if(stack.length===0)
			return null;
		
		return stack[stack.length-1];
	}
	getHand(){
		return this._hand;
	}
	getHandCard(){//card showing on turned up pile. May return null.
		if(this._handIndex<0){
			return null;
		}

		return this._hand[this._handIndex];
	}
	get handIndex(){
		return this._handIndex;
	}
	getCardBehindHandCard(){//card behind card showing on turned up pile. May return null.
		if(this._handIndex<1){
			return null;
		}

		return this._hand[this._handIndex-1];
	}
	_calculateLowestUpValue(){
		let min = 20;
		this._upStacks.forEach(function(upStack){
			if(upStack.length<min){
				min = upStack.length;
			}
		});
		return min;
	}
	getLowestUpValue(){
		return this._lowestUpValue;
	}
	getActionsSinceHandReset(){
		return this._actionsSinceHandReset;
	}
	getTimesHandTurnedOver(){
		return this._timesHandTurnedOver;
	}
	isWinState(){
		return this.getLowestUpValue()===13;
	}
	
	setup(){
		//make main structures
		this._upStacks = [[],[],[],[]];//arrays inside: 0 is bottom of stack
		this._underMainStacks = [[],[],[],[],[],[],[]];//cards that are turn over. arrays inside: 0 is bottom of stack
		this._mainStacks = [[],[],[],[],[],[],[]];//cards that are face up. arrays inside: 0 is bottom of stack (highest card)
		this._hand = [];//0,1,2 are the indexes of the first cards that are turned up
		this._handIndex = -1;
		this._lowestUpValue = 0;//maintained when card is put up
		this._actionsSinceHandReset = 0;
		this._timesHandTurnedOver = 0;

		//generate random ids
		let idArray = [];//card id: 0 is ace of hearts, 1 is two of hearts, ect order is hearts,diamonds,spades,clubs
		for(var i=0;i<52;i++){
			idArray.push(i);
		}

		//shuffle idArray
		idArray.forEach(function(item, index, arr){
			let randomIndex = Math.floor(Math.random()*52);
			//swap
			let temp = arr[index];
			arr[index] = arr[randomIndex];
			arr[randomIndex] = temp;
		});

		//make and distribute cards
		let cardIdIndex = 0;//goes from 0 to 51. picks random id's from idArray
		//put in under stacks
		for(let stackIndex=0;stackIndex<7;stackIndex++){//where to start
			for(let passIndex=stackIndex+1;passIndex<7;passIndex++){
				let cardId = idArray[cardIdIndex++];
				let card = new Card(cardId);
				card.turnFaceDown();
				this._underMainStacks[passIndex].push(card);
			}
		}
		//put in main stacks
		for(let stackIndex=0;stackIndex<7;stackIndex++){
			let cardId = idArray[cardIdIndex++];
			let card = new Card(cardId);
			this._mainStacks[stackIndex].push(card);
		}

		//put the rest in hand
		for(;cardIdIndex<52;cardIdIndex++){
			let cardId = idArray[cardIdIndex];
			let card = new Card(cardId);
			card.turnFaceDown();
			this._hand.push(card);
		}

		// this.printGameState();

		// console.log('stack to stack: ' + this.checkStackToStack()?.from + ' ' + + this.checkStackToStack()?.to);
		// console.log('stack to up: ' + this.checkStackToUp()?.from + ' ' + + this.checkStackToUp()?.to);
	}

	getCardsInHandFaceDown(){
		return this._hand.length-this._handIndex-1;
	}
	getCardsInHandFaceUp(){
		return this._handIndex+1;
	}

	printGameState(){
		//ups
		let upStacksString = 'Up: ';
		this._upStacks.forEach(function(stack){
			if(stack.length===0)
				upStacksString += '-';
			else
				upStacksString += stack[stack.length-1];
		});
		console.log(upStacksString);

		//stacks
		for(let stackIndex=0;stackIndex<7;stackIndex++){
			if(this._mainStacks[stackIndex].length===0 && this._underMainStacks[stackIndex].length===0){
				console.log('-');
			}else{
				let stackString = '';
				if(this._mainStacks[stackIndex].length!=0){
					stackString += this._mainStacks[stackIndex].toString();
					if(this._underMainStacks[stackIndex].length!=0)
						stackString += ',';
				}
				if(this._underMainStacks[stackIndex].length!=0){
					stackString += this._underMainStacks[stackIndex].toString();
				}
				console.log(stackString);
			}
		}

		// console.log(this.locationOfSuitIdInUp(0));
		//hand
		console.log('hand: ' + this._hand.toString());
	}




	locationOfSuitIdInUp(suitId){
		this._upStacks.forEach(function(upStack,index){
			if(upStack.length>0){
				if(upStack[0].suitId===suitId){
					return index;
				}
			}
		});
		return -1;
	}


	//returns index of stack to reveal or -1
	getUnrevealedStackIndex(){
		for(let index=6;index>=0;index--){
			if(this.getMainStack(index).length===0 && this.getUnderMainStack(index).length>0){
				return index;
			}
		}
		return -1;
	}

	//returns true if move is legal. False if not
	/////todo: fromWithinStackIndex
	checkMove(fromPosition,fromStackIndex,fromWithinStackIndex,toPosition,toStackIndex){
		let card;
		if(fromPosition==='hand'){
			card=this.getHandCard();
		}else if(fromPosition==='main'){
			card=this.getMainStack(fromStackIndex)[fromWithinStackIndex];
		}

		if(fromPosition==='hand' && toPosition==='main'){
			return this._cardCanGoToStack(card,toStackIndex);
		}
		if(fromPosition==='hand' && toPosition==='up'){
			return this._cardCanGoUpIndex(card,toStackIndex);
		}
		if(fromPosition==='main' && toPosition==='main'){
			return this._cardCanGoToStack(card,toStackIndex);
		}
		if(fromPosition==='main' && toPosition==='up'){
			if(fromWithinStackIndex!=this.getMainStack(fromStackIndex).length-1){//if the card is not the top of the stack, disqualify it
				return false;
			}
			return this._cardCanGoUpIndex(card,toStackIndex);
		}

		return false;
	}


	//returns{from:#,to:#} or null
	checkStackToStack(){
		for(let fromIndex=6;fromIndex>=0;fromIndex--){/////let fromIndex=0;fromIndex<7;fromIndex++    let fromIndex=6;fromIndex>=0;fromIndex--
			let fromStack = this._mainStacks[fromIndex];
			if(fromStack.length===0)
				continue;
			let fromBottomCard = fromStack[0];

			if(fromBottomCard.char==='K' && this.getUnderMainStack(fromIndex).length===0){////add param for allowing redundant moves?
				//don't bother trying to move the king to another blank space
				continue;
			}

			for(let toIndex=0;toIndex<7;toIndex++){
				if(fromIndex===toIndex)
					continue;
				if(this._cardCanGoToStack(fromBottomCard,toIndex)){
					return {from:fromIndex,to:toIndex};
				}
			}
		}

		return null;
	}
		//support method. returns bool  //to main stack
		_cardCanGoToStack(card,stackID){
			let toTopCard = this.getTopCardOnMainStack(stackID);
			if(toTopCard==null){
				return card.char==='K' &&  this._underMainStacks[stackID].length===0;
			}

			
			if(card.value+1===toTopCard.value && card.colorId != toTopCard.colorId){
				return true;
			}

			return false;
		}
	//returns{from:#,to:#} or null
	checkStackToUp(){
		for(let fromIndex=6;fromIndex>=0;fromIndex--){/////let fromIndex=0;fromIndex<7;fromIndex++     let fromIndex=6;fromIndex>=0;fromIndex--
			let fromTopCard = this.getTopCardOnMainStack(fromIndex);
			if(fromTopCard==null)
				continue;

			let indexToGoUp = this.cardCanGoUp(fromTopCard);
			if(indexToGoUp===-1){
				continue;
			}else{
				return {from:fromIndex,to:indexToGoUp};
			}
			
		}

		return null;
	}
		//support method. returns stack index or -1 for can't
		cardCanGoUp(card){
			for(let toIndex=0;toIndex<4;toIndex++){
				let toStack = this._upStacks[toIndex];
				if(toStack.length===0){
					if(card.char!='A')
						continue;

					//see if the prefered index for the ace is available
					if(this._upStacks[card.suitId].length===0)
						return card.suitId;

					return toIndex;//Ace to open stack
				}

				let toTopCard = toStack[toStack.length-1];
				if(card.value-1===toTopCard.value && card.suitId === toTopCard.suitId){
					return toIndex;
				}
			}

			return -1;
		}
		_cardCanGoUpIndex(card,upIndex){
			let toStack = this._upStacks[upIndex];
			if(toStack.length===0){
				return card.char==='A';
			}

			let toTopCard = toStack[toStack.length-1];
			return card.value-1===toTopCard.value && card.suitId === toTopCard.suitId;
		}
	//returns{from:#,to:#} or null
	//only checks current card
	checkHandCardToMain(){
		let handCard = this.getHandCard();
		if(handCard==null)
			return null;
		for(let toIndex=0;toIndex<7;toIndex++){
			if(this._cardCanGoToStack(handCard,toIndex)){
				return {from:this._handIndex,to:toIndex};
			}
		}
		return null;
	}
	//returns{from:#,to:#} or null
	//only checks current card
	checkHandCardToUp(){
		let handCard = this.getHandCard();
		if(handCard==null)
			return null;
		let indexToGoUp = this.cardCanGoUp(handCard);
		if(indexToGoUp===-1){
			return null;
		}else{
			return {from:this._handIndex,to:indexToGoUp};
		}
	}

	//returns true if reseting hand
	turnHand(){
		if(this._handIndex===this._hand.length-1){
			// was already at the very end, so reset
			this._handIndex = -1;
			this._hand.forEach(function(card){
				card.turnFaceDown();
			});
			this._actionsSinceHandReset = 0;
			this._timesHandTurnedOver++;
			return true;
		}

		let oldIndex = this._handIndex;

		if(this._hand.length>7){
			this._handIndex+=3;
		}else{
			this._handIndex+=1;
		}
		if(this._handIndex>=this._hand.length){
			this._handIndex = this._hand.length-1;//cap out
		}

		for(let index=oldIndex+1;index<=this._handIndex;index++){
			this._hand[index].turnFaceUp();
		}

		return false;
	}

	reveal(stackIndex){
		let underStack = this.getUnderMainStack(stackIndex);
		let mainStack = this.getMainStack(stackIndex);
		if(underStack.length===0 || mainStack.length>0)
			return;//can't turn over

		let card = underStack.pop();
		mainStack.push(card);
		card.turnFaceUp();
	}


	//assumes it has already been checked
	applyMove(fromPosition,fromStackIndex,fromWithinStackIndex,toPosition,toStackIndex){
		if(fromPosition==='hand' && toPosition==='main'){
			this.moveFromHandToMain(toStackIndex);
			return;
		}
		if(fromPosition==='hand' && toPosition==='up'){
			this.moveFromHandToUp(toStackIndex);
			return;
		}
		if(fromPosition==='main' && toPosition==='main'){
			this.moveFromStackToStack(fromStackIndex,fromWithinStackIndex,toStackIndex);
			return;
		}
		if(fromPosition==='main' && toPosition==='up'){
			this.moveFromStackToUp(fromStackIndex,toStackIndex);
			return;
		}
	}


	//validity assumed to have been already checked
	moveFromHandToMain(stackIndex){
		let handCard = this.getHandCard();
		let stack = this.getMainStack(stackIndex);

		stack.push(handCard);
		//delete card from hand
		this._hand.splice(this._handIndex,1);
		this._handIndex--;
		this._actionsSinceHandReset++;
	}
	//validity assumed to have been already checked
	moveFromHandToUp(upIndex){
		let handCard = this.getHandCard();
		let stack = this.getUpStack(upIndex);

		stack.push(handCard);
		//delete card from hand
		this._hand.splice(this._handIndex,1);
		this._handIndex--;
		this._lowestUpValue = this._calculateLowestUpValue();
		this._actionsSinceHandReset++;
	}
	//validity assumed to have been already checked
	moveFromStackToStack(fromStackIndex,fromStackWithinIndex,toStackIndex){
		let fromStack = this.getMainStack(fromStackIndex);
		let movingStack = fromStack.slice(fromStackWithinIndex);
		let toStack = this.getMainStack(toStackIndex);

		toStack.push.apply(toStack,movingStack);//append from stack to toStack
		fromStack.splice(fromStackWithinIndex,fromStack.length);//delete everything from fromStack starting from fromStackWithinIndex
		this._actionsSinceHandReset++;
	}
	//validity assumed to have been already checked
	moveFromStackToUp(stackIndex,upIndex){
		let fromStack = this.getMainStack(stackIndex);
		let upStack = this.getUpStack(upIndex);

		let card = fromStack.pop();
		upStack.push(card);
		this._lowestUpValue = this._calculateLowestUpValue();
		this._actionsSinceHandReset++;
	}

}