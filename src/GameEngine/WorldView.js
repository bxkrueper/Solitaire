"use strict";
//todo:
//move auto-redraw back to world?
//double clicks need to be the same type

//   JavaScript Expression Evaluator?      http://algebra.js.org/   ?

//don't add properties to object
//when to call world.setTarget()?
//static methods for telling if a string is graphable

//shift + numKey pad: computer automatically unshifts and puts key code instead, but code for Pgup and Pgdn are wrong?
///////keep drawWorld and Accept mouse target together?
//import other files cleanly and in right order and not all in html          import myInstance from './my-singleton.js'    RequireJS    export default before the word class in World.js      type="module" in html tag
//grid: show numbers more often, minor numbers are grey  ctx.measureText(text).width    function for what text size will give a certain width?  ctx.fillText(text, x, y, maxWidth)
//allow worlds to be assigned to different worldViews and world views to change worlds
//seperate worldView event listener functions

//stop redraw checks when page clicked away (possible???)

//use LaTeX?

// import World from './World.js'

class WorldView{

  static _keyCodeToStirngMap = Object.freeze({65:"a",66:"b",67:"c",68:"d",69:"e",70:"f",71:"g",72:"h",73:"i",74:"j",75:"k",76:"l",77:"m",
                            78:"n",79:"o",80:"p",81:"q",82:"r",83:"s",84:"t",85:"u",86:"v",87:"w",88:"x",89:"y",90:"z",
                            48:"0",49:"1",50:"2",51:"3",52:"4",53:"5",54:"6",55:"7",56:"8",57:"9",
                            37:"left",38:"up",39:"right",40:"down",32:"space",13:"enter",16:"shift",17:"ctrl",9:"tab",18:"alt",
                            96:'0',97:'1',98:'2',99:'3',100:'4',101:'5',102:'6',103:'7',104:'8',105:'9',44:"prtscr",145:"scrolllock",19:"pause",45:"insert",
                            27:"esc",192:"`",189:"-",187:"=",8:"backspace",144:"numlock",111:"/",106:"*",109:"-",219:"[",221:"]",220:"\\",
                            20:"capslock",107:"+",110:".",190:".",191:"/",186:";",222:"'",188:",",226:"\\",91:"windows",46:"delete",33:"home",34:"end",35:"end",36:"home",
                            112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12"});
  static _keyCodeToCharTypedNoShift = Object.freeze({65:"a",66:"b",67:"c",68:"d",69:"e",70:"f",71:"g",72:"h",73:"i",74:"j",75:"k",76:"l",77:"m",
                            78:"n",79:"o",80:"p",81:"q",82:"r",83:"s",84:"t",85:"u",86:"v",87:"w",88:"x",89:"y",90:"z",
                            48:"0",49:"1",50:"2",51:"3",52:"4",53:"5",54:"6",55:"7",56:"8",57:"9",
                            96:'0',97:'1',98:'2',99:'3',100:'4',101:'5',102:'6',103:'7',104:'8',105:'9',
                            32:' ',192:"`",189:"-",187:"=",111:"/",106:"*",109:"-",219:"[",221:"]",220:"\\",13:"\n",9:"\t",
                            107:"+",110:".",190:".",191:"/",186:";",222:"'",188:",",226:"\\"});
  static _keyCodeToCharTypedShift = Object.freeze({65:"A",66:"B",67:"C",68:"D",69:"E",70:"F",71:"G",72:"H",73:"I",74:"J",75:"K",76:"L",77:"M",
                            78:"N",79:"O",80:"P",81:"Q",82:"R",83:"S",84:"T",85:"U",86:"V",87:"W",88:"X",89:"Y",90:"Z",
                            48:")",49:"!",50:"@",51:"#",52:"$",53:"%",54:"^",55:"&",56:"*",57:"(",
                            32:' ',192:"~",189:"_",187:"+",111:"/",106:"*",109:"-",219:"{",221:"}",220:"|",13:"\n",9:"\t",
                            107:"+",110:".",190:">",191:"?",186:":",222:"\"",188:"<",226:"|"});

	constructor(ctx) {
      if(ctx==null){
        throw "can't make worldView. Context is null!";
      }else{
        this._ctx = ctx;
      }

      this._redrawPending = false;
      this._redrawCheckInterval = 30;//how many miliseconds it takes to check if it should redraw. This is a throttle on how often redraws can happen
      this._mouseMovedPending = false;
      this._mouseMovedCheckInterval = 40;//This is a throttle on how often mouse updates can happen

    	this._inputStatus = {"currentButtonDown":'none',"mouseInCanvas": false,
    		"currentXScreen":0,"currentYScreen":0,"currentXWorld":0,"currentYWorld":0,
    		"previousXScreen":0,"previousYScreen":0,"previousXWorld":0,"previousYWorld":0,
    		currentKeys:new Set()
    	};

      this._mousedown = this._getMouseDown();
      this._mouseup = this._getMouseup();
      this._mousemove = this._getMouseMoved();
      this._keydown = this._getKeydown();
      this._keyup = this._getKeyup();
      this._wheel = this._getWheel();
      this._mouseenter = this._getMouseenter();
      this._mouseleave = this._getMouseleave();
      this._resize = this._getResize();
      this._onfocusin = this._getOnfocusin();
      this._onfocusout = this._getOnfocusout();
  }

//functions to use when input happens
  get mouseButtonDown(){
    return this._mousedown;
  }
  get mouseButtonUp(){
    return this._mouseup;
  }
  //objects can call this to manually trigger a mouse moved event (like when the camera zooms, mouse is in a different world position)
  get mouseMoved(){
    return this._mousemove;
  }
  get keyDown(){
    return this._keydown;
  }
  get keyUp(){
    return this._keyup;
  }
  get scroll(){
    return this._wheel;
  }
  get mouseEnter(){
    return this._mouseenter;
  }
  get mouseLeave(){
    return this._mouseleave;
  }
  get resize(){
    return this._resize;
  }
  get onfocusin(){
    return this._onfocusin;
  }
  get onfocusout(){
    return this._onfocusout;
  }

  get ctx(){//////////allowed?
    return this._ctx;
  }



//info getters

  //mouse button  expected 'none', 'left', 'middle', 'right'
  get currentButtonDown(){
    return this._inputStatus.currentButtonDown;
  }
  get mouseInCanvas(){
    return this._inputStatus.mouseInCanvas;
  }
  get currentXScreen(){
    return this._inputStatus.currentXScreen;
  }
  get currentYScreen(){
    return this._inputStatus.currentYScreen;
  }
  get currentXWorld(){
    return this._inputStatus.currentXWorld;
  }
  get currentYWorld(){
    return this._inputStatus.currentYWorld;
  }
  get previousXScreen(){
    return this._inputStatus.previousXScreen;
  }
  get previousYScreen(){
    return this._inputStatus.previousYScreen;
  }
  get previousXWorld(){
    return this._inputStatus.previousXWorld;
  }
  get previousYWorld(){
    return this._inputStatus.previousYWorld;
  }
  //returns the Set of current keys down
  get currentKeys(){
    return this._inputStatus.currentKeys;
  }

  //keyName: a,b,1,shift,...
  keyIsDown(keyName){
    return this._inputStatus.currentKeys.has(keyName);
  }

  get canvasWidth(){
    return this._ctx.canvas.width;
  }
  get canvasHeight(){
    return this._ctx.canvas.height;
  }


//the functions to handle input events. These are called once by the constructor and remembered

  _getMouseDown(){
    var self = this;
    return function(event) {
      var buttonType;
      switch(event.button){
        case 0: //left
          buttonType = 'left';
        break;
        case 1: //middle
          event.preventDefault();//stops middle mouse button scroll thing, but not right click context menu
          buttonType = 'middle';
        break;
        case 2: //right
          buttonType = 'right';
        break;
      }

      //only one mouse button is considered to be down at at time. Other button presses that occur during a button press are ignored
      if(self._inputStatus.currentButtonDown === 'none'){
        self._inputStatus.currentButtonDown = buttonType;

        self._inputStatus.previousXScreen = event.offsetX;
        self._inputStatus.previousYScreen = event.offsetY;
        self._inputStatus.previousXWorld = self._world.camera.screenXToWorldX(event.offsetX);
        self._inputStatus.previousYWorld = self._world.camera.screenYToWorldY(event.offsetY);

        self._world.doFunctionToAllObjects('mouseButtonDown',buttonType);

        console.log(buttonType + " mouse button down");
      }
    };
  }
  _getMouseup(){
    var self = this;
    return function(event) {
      var buttonType;
      switch(event.button){
        case 0: //left
          buttonType = 'left';
        break;
        case 1: //middle
          buttonType = 'middle';
        break;
        case 2: //right
          buttonType = 'right';
        break;
      }

      if(self._inputStatus.currentButtonDown === buttonType){
        self._inputStatus.currentButtonDown = 'none';//////////move below doFunctionToAllObjects?

        self._world.doFunctionToAllObjects('mouseButtonUp',buttonType);

        console.log(buttonType + " mouse button up");
      }
      
    };
  }
  

  _getMouseMoved(){
    const self = this;
    return function(event){//this function is called whenever the mouse is moved just a little bit
      if(event ==null){
      
      }else{
        self._inputStatus.currentXScreen = event.offsetX;
        self._inputStatus.currentYScreen = event.offsetY;
      }
      
      
      
      self._mouseMovedPending = true;
    };
  }
  _getKeydown(){
    var self = this;
    return function(event) {
      var keyValue = WorldView._keyCodeToStirngMap[event.keyCode];
      if(keyValue=='space' || keyValue=='up' ||keyValue=='down' ||keyValue=='left' ||keyValue=='right'){
        event.preventDefault();//stops the page from scrolling with the space bar or arrow keys
      }
      if(keyValue=='tab'){
        event.preventDefault();//stops tab from defocusing
      }
      
      

      

      //only fire keydown in world if this was the first event for that key
      if(self._inputStatus.currentKeys.has(keyValue)){
        //do nothing
      }else{
        self._inputStatus.currentKeys.add(keyValue);
        
        console.log("key down: " + event.keyCode + " " + WorldView._keyCodeToStirngMap[event.keyCode]);

        self._world.doFunctionToAllObjects('keyDown',keyValue);
      }


      //keydown in canvas event listener still triggers constantly after key is held. This is called keyInput in world
      console.log("key input: " + event.keyCode + " " + WorldView._keyCodeToStirngMap[event.keyCode]);
      self._world.doFunctionToAllObjects('keyInput',keyValue);

      //string input
      let inputtedChar = self._getCharTyped(event.keyCode,self.keyIsDown('shift'),event.getModifierState("CapsLock"));
      if(self.keyIsDown('ctrl')||self.keyIsDown('alt')){
        inputtedChar = null;
      }
      if(inputtedChar!=null){
        console.log("stringInput (char): '" + inputtedChar + "'");
        self._world.doFunctionToAllObjects('stringInput',inputtedChar);
      }

    };
  }
  _getKeyup(){
    var self = this;
    return function(event) {
      var keyValue = WorldView._keyCodeToStirngMap[event.keyCode];
      self._inputStatus.currentKeys.delete(keyValue);

      console.log("key up: " + event.keyCode + " " + WorldView._keyCodeToStirngMap[event.keyCode]);

      self._world.doFunctionToAllObjects('keyUp',keyValue);
      

      //console.log(Array.from(self._inputStatus.currentKeys).join(','));
    };
  }
  _getWheel(){
    var self = this;
    return function(event){
      var direction = event.deltaY<100?'up':'down';/////////////////100?
      self._world.doFunctionToAllObjects('scroll',direction);

      event.preventDefault();//stops the page from scrolling
      console.log("scroll " + direction);
    };
  }
  _getMouseenter(){
    var self = this;
    return function(){
      console.log("mouse entered canvas");
      self._inputStatus.mouseInCanvas = true;
    };
  }
  _getMouseleave(){
    var self = this;
    return function(){
      console.log("mouse left canvas");
      self._world.doFunctionToAllObjects('mouseButtonUp',this.currentButtonDown);//tell world the mouse button went up even though it may not have
      self._inputStatus.mouseInCanvas = false;
      self._inputStatus.currentButtonDown = 'none';//////////clean up. put input functions in seperate methods
    };
  }
  _getResize(){
    var self = this;
    return function(){
      console.log("window resized: width: " + window.innerWidth + " height: " + window.innerHeight);
      var rect = self._ctx.canvas.getBoundingClientRect();//absolute position of ctx
      console.log(rect.top, rect.right, rect.bottom, rect.left);

      self._ctx.canvas.width = window.innerWidth;
      self._ctx.canvas.height = window.innerHeight-rect.top;
      self._redrawNow();//canvas automatically clears on redraw, so this should be called afterwards no mater what

      

    };
  }
  _getOnfocusin(){
    var self = this;
    return function(){
      console.log("window re-focused!:");
    };
  }
  _getOnfocusout(){
    var self = this;
    return function(){
      console.log("window de-focused!:");
      //clear memory of current keys down
      self._inputStatus.currentKeys.clear();
    };
  }






//called when the world is set
/////////call some or all in constructor?  (world is null then)   if I want to change the world, this might need work.
  setContextListeners(){
    var self = this;

    this._ctx.canvas.addEventListener('mousedown', this.mouseButtonDown);
    this._ctx.canvas.addEventListener('mouseup', this.mouseButtonUp);
    this._ctx.canvas.addEventListener('mousemove', this.mouseMoved);
    this._ctx.canvas.addEventListener('keydown', this.keyDown,false);
    this._ctx.canvas.addEventListener('keyup', this.keyUp,false);
    this._ctx.canvas.addEventListener('wheel', this.scroll,false);
    this._ctx.canvas.addEventListener('mouseenter', this.mouseEnter);
    this._ctx.canvas.addEventListener('mouseleave', this.mouseLeave);
    this._ctx.canvas.addEventListener('focusin', this.onfocusin);
    this._ctx.canvas.addEventListener('focusout', this.onfocusout);
    window.addEventListener("resize", this.resize);

    //redraw throttle
    setInterval(function(){
      if(self._redrawPending){
        self._redrawNow();
      }
      
      } , this._redrawCheckInterval);
    //mouseMoved throttle
    setInterval(function(){
      if(self._mouseMovedPending){
        self._mouseMovedNow();
      }
      
      } , this._mouseMovedCheckInterval);

    //make canvas focus  
    this._ctx.canvas.setAttribute('tabindex','0');
    this._ctx.canvas.focus();//side effect: screen scrolls down to it
    window.scrollTo(0, 0);//put scroll back to top

    //disable right click context menu in the game
    this._ctx.canvas.addEventListener("contextmenu", function(event){
      event.preventDefault();
    }, false);
  }


  get world(){
    return this._world;
  }
  set world(world){
    this._world = world;

    let self = this;
    this._world.worldView = self;

    this._world.doOnWorldViewSet();

    this.setContextListeners();
  }

  getTextLength(text,textSize,fontName){
    this._ctx.font = textSize + 'px ' + fontName;
    return this._ctx.measureText(text).width;
  }

  



  redraw(){
    this._redrawPending = true;
  }

  _redrawNow(){
    // console.log('redrawing...');
    
    //clear the canvas
    this._ctx.setTransform(1, 0, 0, 1, 0, 0);
    this._ctx.clearRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);

    //tell camera canvas width and height;
    this._world.camera.screenWidth = this._ctx.canvas.width;
    this._world.camera.screenHeight = this._ctx.canvas.height;


    this._ctx.save();
    this._world.camera.transformContext(this._ctx);
    this._world.doFunctionToAllObjects('drawWorld',this._ctx);//add draw world objects assume the canvas has been transformed to world coordinates
    this._ctx.restore();

    this._world.doFunctionToAllObjects('drawScreen',this._ctx);//canvas context has been reverted back to screen coordinates (origin top left, +x right, +y down)
    this._redrawPending = false;
  }

  

  _mouseMovedNow(){
    const self = this;
    /////////////////do in non-now method?  put here to reduce conversion calculations
    self._inputStatus.currentXWorld = self._world.camera.screenXToWorldX(self._inputStatus.currentXScreen);
    self._inputStatus.currentYWorld = self._world.camera.screenYToWorldY(self._inputStatus.currentYScreen);
    //self._inputStatus.mouseInCanvas = true;///////neened?

    this._world.doFunctionToAllObjects('mouseMoved');
    if(this._inputStatus.currentButtonDown != 'none'){
      this._world.doFunctionToAllObjects('mouseDraged');
      console.log("mouse moved and draged");
    }else{
      console.log("mouse moved");
    }
    this._mouseMovedPending = false;
    
  }

  _getCharTyped(keyCode,shift,capsLock){
    if(keyCode>=65 && keyCode<=90){//if it is a letter key
      if(shift == capsLock){//they cancel out
        return WorldView._keyCodeToCharTypedNoShift[keyCode];
      }else{
        return WorldView._keyCodeToCharTypedShift[keyCode];
      }
    }else{
      if(shift){//caps lock doesn't matter
        return WorldView._keyCodeToCharTypedShift[keyCode];
      }else{
        return WorldView._keyCodeToCharTypedNoShift[keyCode];
      }
    }
  }



}