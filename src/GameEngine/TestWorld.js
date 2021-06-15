"use strict";

class TestWorld extends World{
	constructor(){
		super();
		this.editMode = false;
		// this.addTimer('gameTick',300);
		let displayUpdaterObject = new DisplayUpdaterObject(this,
														document.getElementById('buttonInfo'),
														document.getElementById('currentXScreenInfo'),
														document.getElementById('currentYScreenInfo'),
														document.getElementById('currentXWorldInfo'),
														document.getElementById('currentYWorldInfo'),
														document.getElementById('previousXScreenInfo'),
														document.getElementById('previousYScreenInfo'),
														document.getElementById('previousXWorldInfo'),
														document.getElementById('previousYWorldInfo'),
														document.getElementById('keysPressedInfo'));
		this.add(displayUpdaterObject);

		this.add(new CameraManipulatorObject());
		// this.add(new Square(-2,-2,"#FF0000"));
		// this.add(new ScreenSquare(100,100,"#FF0000"));
		this.add(new ExpressionSpawner());
		
		// this.add(new Square(0,0,"#00FF00"));
		// this.add(new Square(2,2,"#0000FF"));
		this.add(new CartesianGrid());
		
	}

	//override
	doOnWorldViewSet(){
		this.redrawAfter('mouseButtonDown');
		this.redrawAfter('mouseButtonUp');
		this.redrawAfter('mouseMoved');
		this.redrawAfter('keyUp');
		this.redrawAfter('keyInput');
		this.redrawAfter('scroll');
	}

	//override
	generateCamera(){
		return new MoveZoomCamera(0,0,60,-60);
	}
}