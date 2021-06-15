"use strict";

class Card{
	static suitIdToTextArray = ['Hearts','Diamonds','Spades','Clubs'];
	static colorIdToTextArray = ['red','black'];
	static valueToCharArray = [null,'A','2','3','4','5','6','7','8','9','10','J','Q','K'];
	static valueToWordArray = [null,'Ace','2','3','4','5','6','7','8','9','10','Jack','Queen','King'];

	constructor(cardId){//card id: 0 is ace of hearts, 1 is two of hearts, ect order is hearts,diamonds,spades,clubs
		this.cardId = cardId;

		this.value = cardId%13 + 1;

		// //this.character and this.word
		// if(this.value >= 2 && this.value<=10){
		// 	this.character = this.value.toString();
		// }else if(this.value === 1) this.character = 'A';
		// else if(this.value === 11) this.character = 'J';
		// else if(this.value === 12) this.character = 'Q';
		// else this.character = 'K';

		//this.suit
		this.suitId = Math.floor(cardId/13);//0: hearts, 1: diamonds, 2: spades, 3: clubs
		this.colorId = Math.floor(this.suitId/2);//0:red, 1: black
		// if(this.suitId===0){this.suit = 'Hearts';this.color = 'red';}
		// else if(this.suitId===1){this.suit = 'Diamonds';this.color = 'red';}
		// else if(this.suitId===2){this.suit = 'Spades';this.color = 'black';}
		// else{this.suit = 'Clubs';this.color = 'black';}

		this._faceUp = true;
	}

	get suit(){
		return Card.suitIdToTextArray[this.suitId];
	}
	get color(){
		return Card.colorIdToTextArray[this.colorId];
	}
	get char(){
		return Card.valueToCharArray[this.value];
	}
	get word(){
		return Card.valueToWordArray[this.value];
	}

	get faceUp(){
		return this._faceUp;
	}
	get faceDown(){
		return !this._faceUp;
	}

	turnFaceUp(){
		this._faceUp = true;
	}
	turnFaceDown(){
		this._faceUp = false;
	}
	flip(){
		this._faceUp = !this._faceUp;
	}

	toString(){
		if(this.faceUp){
			return this.char + this.suit[0];
		}else{
			return this.char + this.suit[0]+'?';
		}
		
	}
}
