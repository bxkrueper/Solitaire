"use strict";

class MoveZoomCamera{
	constructor(xCenter = 0,yCenter = 0,pixelsPerUnitX = 1,pixelsPerUnitY = 1){
		//world coordinates of center
		this._xCenter = xCenter;
        this._yCenter = yCenter;

        //can be negative to invert axis
        this._pixelsPerUnitX = pixelsPerUnitX;
        this._pixelsPerUnitY = pixelsPerUnitY;

        //how many pixles the canvas is. This is set by the WorldView
        this._screenWidth = 0;
        this._screenHeight = 0;
	}

	//getters and setters
	get xCenter(){
		return this._xCenter;
	}
	get yCenter(){
		return this._yCenter;
	}
	get pixelsPerUnitX(){
		return this._pixelsPerUnitX;
	}
	get pixelsPerUnitY(){
		return this._pixelsPerUnitY;
	}
	get screenWidth(){
		return this._screenWidth
	}
	get screenHeight(){
		return this._screenHeight
	}
	set xCenter(xCenter){
		this._xCenter = xCenter;
	}
	set yCenter(yCenter){
		this._yCenter = yCenter;
	}
	set pixelsPerUnitX(pixelsPerUnitX){
		this._pixelsPerUnitX = pixelsPerUnitX;
	}
	set pixelsPerUnitY(pixelsPerUnitY){
		this._pixelsPerUnitY = pixelsPerUnitY;
	}
	set screenWidth(screenWidth){
		this._screenWidth = screenWidth;
	}
	set screenHeight(screenHeight){
		this._screenHeight = screenHeight;
	}

	//non-direct getters
	get pixelsPerUnitXPos(){
		return Math.abs(this._pixelsPerUnitX);
	}
	get pixelsPerUnitYPos(){
		return Math.abs(this._pixelsPerUnitY);
	}
	get unitsPerPixelX(){
		return 1/this._pixelsPerUnitX;
	}
	get unitsPerPixelY(){
		return 1/this._pixelsPerUnitY;
	}
	get unitsPerPixelXPos(){
		return 1/Math.abs(this._pixelsPerUnitX);
	}
	get unitsPerPixelYPos(){
		return 1/Math.abs(this._pixelsPerUnitY);
	}

	// set unitsPerPixelX(unitsPerPixelX){
	// 	this._pixelsPerUnitX = 1/unitsPerPixelX;
	// }
	// set unitsPerPixelY(unitsPerPixelY){
	// 	this._pixelsPerUnitY = 1/unitsPerPixelY;
	// }

	//world coordinates. Always positive
	get width(){
		return this.screenWidth/this.pixelsPerUnitXPos;
	}
	get height(){
		return this.screenHeight/this.pixelsPerUnitYPos;
	}

	//world coordinates
    //the most extreme values for the sides of the camera. may be different than getRight, getTop... if a scale is negative
    get highestX(){
    	return this.xCenter+this.width/2;
    }
    get lowestX(){
    	return this.xCenter-this.width/2;
    }
    get highestY(){
    	return this.yCenter+this.height/2;
    }
    get lowestY(){
    	return this.yCenter-this.height/2;
    }

    //world coordinate of indicated side of the screen
    get right(){
    	return this.xCenter+this.screenWidth/this.pixelsPerUnitX/2;
    }
    get left(){
    	return this.xCenter-this.screenWidth/this.pixelsPerUnitX/2;
    }
    get top(){
    	return this.yCenter-this.screenHeight/this.pixelsPerUnitY/2;
    }
    get bottom(){
    	return this.yCenter+this.screenHeight/this.pixelsPerUnitY/2;
    }

    set highestX(newX){
    	this.xCenter = newX-this.width/2;
    }
    set lowestX(newX){
    	this.xCenter = newX+this.width/2;
    }
    set highestY(newY){
    	this.yCenter = newY-this.height/2;
    }
    set lowestY(newY){
    	this.yCenter = newY+this.height/2;
    }
	
	set right(newX){
    	this._xCenter = newX-(this.screenWidth/this.pixelsPerUnitX)/2;
    }
    set left(newX){
    	this._xCenter = newX+(this.screenWidth/this.pixelsPerUnitX)/2;
    }
    set top(newY){
    	this._yCenter = newY+(this.screenHeight/this.pixelsPerUnitY)/2;//sign different than for x because pos y is normally down
    }
    set bottom(newY){
    	this._yCenter = newY-(this.screenHeight/this.pixelsPerUnitY)/2;//sign different than for x because pos y is normally down
    }


    //convert between world coordinates scree pixel coordinates. Screen pixel coordinates are measured from the top left
    worldXToScreenX(worldX){
    	return (worldX-this.xCenter)*this.pixelsPerUnitX + (this.screenWidth/2);
    }
    worldYToScreenY(worldY){
    	return ((worldY-this.yCenter)*this.pixelsPerUnitY + (this.screenHeight/2));
    }
    screenXToWorldX(screenX){
    	return (screenX - (this.screenWidth/2))/this.pixelsPerUnitX+this.xCenter;
    }
    screenYToWorldY(screenY){
    	return (screenY - (this.screenHeight/2))/this.pixelsPerUnitY+this.yCenter;
    }

    transformContext(ctx){
    	ctx.translate(this.screenWidth/2,this.screenHeight/2);
        ctx.scale(this.pixelsPerUnitX,this.pixelsPerUnitY);
        ctx.translate(-this.xCenter,-this.yCenter);
    }

}