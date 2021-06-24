
class SolitaireWorld extends World{

	constructor(){
		super();
		this._setPriorities();

		this.debugMode = false;
		this.add(new DebugToggle('d',['shift']));
		this.add(new DisplayUpdaterObject());
		this.add(new Background());
		// this.add(new CardObject(new Card(0),200,200,70));
	}

	//override
	doOnWorldViewSet(){
		this.redrawAfter('mouseButtonDown');
		this.redrawAfter('mouseButtonUp');
		// this.redrawAfter('mouseMoved');
		this.redrawAfter('mouseDraged');
		this.redrawAfter('keyUp');
		this.redrawAfter('keyInput');
		// this.redrawAfter('scroll');


		this.gameLogic = new GameLogic();
		this.gameDisplayObject = new GameDisplayObject(this.gameLogic);
		this.add(this.gameDisplayObject);
	}

	//override
	generateCamera(){
		return new MoveZoomCamera();
	}

	

	_setPriorities(){
		this.priorities['Background'] = -10;
		this.priorities['FakeCards'] = -5;
		this.priorities['CardObject'] = 0;//0 is for cards at the bottom of the stack. +1 for every card that is below it
		//20 is added temporarily while they are being draged so the max a card will have is 12+20=32
	}
	
}