class _Images{

	static pathToImageFolder = "images/";/////have main class set this?
	static missingImageFileName = "MissingImage.jpg";

	constructor(){
		this._map = {};
	}

	//src is relative to the base directory for images (pathToImageFolder will be added before it)
	get(src){
		if(src in this._map){
            return this._map[src];
        }else{
            var myImage = this._read(_Images.pathToImageFolder + src);
            this._map[src] = myImage;

            //////////path. inefficient??? to have this function for every image???
            myImage.onerror = function(){
            	return this.src = "../images/" + _Images.missingImageFileName;
            }

            // console.log('loaded image: ' + src);
            return myImage;
        }
	}

	//only for world coordinates
	//makes sure the image is drawn non-flipped, despite how the canvas may have been scaled
	draw(image,x,y,width,height,ctx,camera){
		ctx.save();

		ctx.translate(x,y);
		if(camera.pixelsPerUnitX<0){
			ctx.translate(width,0);
			ctx.scale(-1,1);
		}
		if(camera.pixelsPerUnitY<0){
			ctx.translate(0,height);
			ctx.scale(1,-1);
		}

		ctx.drawImage(image,0,0,width,height);

		ctx.restore();
	}

	//loads and returns the image from the file
	_read(completeSrc){
		let image = new Image();
		image.src = completeSrc;
		return image;
	}
}

var Images = new _Images();/////global namespace