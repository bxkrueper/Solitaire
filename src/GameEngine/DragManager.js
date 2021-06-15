"use strict";
//example usage: put in doOnAdd
// this._dragManager = new DragManager('left',this,'currentXWorld','currentYWorld',this.containsPoint,'world');
// this._dragManager.addDragLogic(this.priority);
class DragManager{

	constructor(mouseButton,clientObject,xVarName,yVarName,containsPointFunction,type = 'world'){
		this._mouseButton = mouseButton;
		this._clientObject = clientObject;
		this.xVarName = xVarName;
		this.yVarName = yVarName;
		this._containsPointFunction = containsPointFunction;
		this._type = type;

		this._xOnTarget;//client's position on target time
		this._yOnTarget;
		this._dragging;

		this._mouseButtonDown = this.get_mouseButtonDown();
		this._acceptMouseTarget = this.get_acceptMouseTarget();
		this._mouseMoved = this.get_mouseMoved();
		this._mouseButtonUp = this.get_mouseButtonUp();

		this._dragLogicAdded = false;
	}

	get xOnDragStart(){
		return this._xOnTarget;
	}
	get yOnDragStart(){
		return this._yOnTarget;
	}
	get dragging(){
		return this._dragging;
	}

	
	addDragLogic(priority=0){
		if(this._dragLogicAdded){
			console.log('drag logic already added to ' + this._clientObject + ' nothing done');
			return;
		}
		this._xOnTarget = 0;//client's position on target time
		this._yOnTarget = 0;
		this._dragging = false;

		this._clientObject.world.addEventListener(this._clientObject,'mouseButtonDown',this._mouseButtonDown);
		this._clientObject.world.addEventListener(this._clientObject,'acceptMouseTarget',this._acceptMouseTarget,priority);///////don't add if already added??? do this somewheere else?
		this._clientObject.world.addEventListener(this._clientObject,'mouseMoved',this._mouseMoved);
		this._clientObject.world.addEventListener(this._clientObject,'mouseButtonUp',this._mouseButtonUp);

		this._dragLogicAdded = true;
	}
	
	
	deleteDragLogic(){
		if(!this._dragLogicAdded){
			console.log('drag logic not added to ' + this._clientObject + ' nothing done');
			return;
		}
		// delete this._clientObject._xOnTarget;///////////keep in this object instead of giving to client
		// delete this._clientObject._yOnTarget;
		// delete this._clientObject._dragging;

		this._clientObject.world.removeEventListener(this._clientObject,'mouseButtonDown',this._mouseButtonDown);
		this._clientObject.world.removeEventListener(this._clientObject,'acceptMouseTarget',this._acceptMouseTarget);//////priority
		this._clientObject.world.removeEventListener(this._clientObject,'mouseMoved',this._mouseMoved);
		this._clientObject.world.removeEventListener(this._clientObject,'mouseButtonUp',this._mouseButtonUp);

		this._dragLogicAdded = false;
	}

	//returns methods to be used by the world lists, which call these methods as if the client called them

	get_mouseButtonDown(){
		let clientObject = this._clientObject;
		let mouseButton = this._mouseButton;
		let xVarName = this.xVarName;
		let yVarName = this.yVarName;
		let self = this;
		return function(buttonType){
			if(this.world.currentTarget == this && buttonType==mouseButton){
				self._xOnTarget = clientObject[xVarName];
				self._yOnTarget = clientObject[yVarName];
				self._dragging = true;
			}
		};
	}

	get_acceptMouseTarget(){
		let containsPointFunction = this._containsPointFunction;
		let clientObject = this._clientObject;
		if(this._type == 'world'){
			return function(){
				return containsPointFunction.call(clientObject,this.world.worldView.currentXWorld,this.world.worldView.currentYWorld);
			};
		}else{//'screen'
			return function(){
				return containsPointFunction.call(clientObject,this.world.worldView.currentXScreen,this.world.worldView.currentYScreen);
			};
		}
		
	}

	get_mouseMoved(){
		let xVarName = this.xVarName;
		let yVarName = this.yVarName;
		let clientObject = this._clientObject;
		let self = this;
		if(this._type == 'world'){
			return function(){
				if(self._dragging){
					//drag
					clientObject[xVarName] = self._xOnTarget+this.world.worldView.currentXWorld-this.world.worldView.previousXWorld;
					clientObject[yVarName] = self._yOnTarget+this.world.worldView.currentYWorld-this.world.worldView.previousYWorld;
				}
			};
		}else{//'screen'
			return function(){
				if(self._dragging){
					//drag
					clientObject[xVarName] = self._xOnTarget+this.world.worldView.currentXScreen-this.world.worldView.previousXScreen;
					clientObject[yVarName] = self._yOnTarget+this.world.worldView.currentYScreen-this.world.worldView.previousYScreen;
				}
			};
		}
		
	}

	get_mouseButtonUp(){
		let self = this;
		return function(){
			self._dragging = false;
		};
	}





	toString(){
		return "DragManager";
	}

	

}