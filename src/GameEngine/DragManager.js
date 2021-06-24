"use strict";
//example usage: put in doOnAdd
// this._dragManager = new DragManager('left',this,'currentXWorld','currentYWorld',this.containsPoint,'world',this.doOnDragedFunction,this.doOnDropedFunction);
// this._dragManager.addDragLogic(this.priority);
class DragManager{

	constructor(mouseButton,clientObject,xVarName,yVarName,containsPointFunction,type = 'world',doOnPickedUpFunction,doOnDragedFunction,doOnDropedFunction){
		this._mouseButton = mouseButton;
		this._clientObject = clientObject;
		this.xVarName = xVarName;
		this.yVarName = yVarName;
		this._containsPointFunction = containsPointFunction;
		this._type = type;
		this._doOnPickedUpFunction = doOnPickedUpFunction;
		this._doOnDragedFunction = doOnDragedFunction;
		this._doOnDropedFunction = doOnDropedFunction;

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

	changeTargetDetectPriority(priority){
		this._clientObject.world.changePriority(this._clientObject,'acceptMouseTarget',this._acceptMouseTarget,this.priority);
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
		let doOnPickedUpFunction = this._doOnPickedUpFunction;
		return function(buttonType){
			if(this.world.currentTarget == this && buttonType==mouseButton){
				self._xOnTarget = clientObject[xVarName];
				self._yOnTarget = clientObject[yVarName];
				self._dragging = true;
				doOnPickedUpFunction?.call(clientObject);
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
		let doOnDragedFunction = this._doOnDragedFunction;
		let self = this;
		if(this._type == 'world'){
			return function(){
				if(self._dragging){
					//drag
					clientObject[xVarName] = self._xOnTarget+this.world.worldView.currentXWorld-this.world.worldView.previousXWorld;
					clientObject[yVarName] = self._yOnTarget+this.world.worldView.currentYWorld-this.world.worldView.previousYWorld;
					doOnDragedFunction?.call(clientObject);
				}
			};
		}else{//'screen'
			return function(){
				if(self._dragging){
					//drag
					clientObject[xVarName] = self._xOnTarget+this.world.worldView.currentXScreen-this.world.worldView.previousXScreen;
					clientObject[yVarName] = self._yOnTarget+this.world.worldView.currentYScreen-this.world.worldView.previousYScreen;
					doOnDragedFunction?.call(clientObject);
				}
			};
		}
		
	}

	get_mouseButtonUp(){
		let doOnDropedFunction = this._doOnDropedFunction;
		let self = this;
		let clientObject = this._clientObject;
		return function(){
			if(self._dragging){
				doOnDropedFunction?.call(clientObject);
				self._dragging = false;
			}
			
		};
	}





	toString(){
		return "DragManager";
	}

	

}