//add a method to all objects. //makes checking for methods cleaner
////////this extra method is included in every object you  try to iterate through
// Object.prototype.hasMethod = function(methodName)
// {
//     return ((typeof this[methodName]) == "function");
// };

class MyAlgs{


	//binString can be really long
	//adds extra 0's at the end if needed
	static binaryStringToHexString(bin){
		//make sure it is a multiple of 4
		let added0s = (4-bin.length%4)%4;
		for(let i=0;i<added0s;i++){
			bin += '0';
		}

		let finalString = '';
		for(let i=0;i<bin.length;i+=4){
			finalString += parseInt(bin.slice(i,i+4), 2).toString(16);
		}

		return finalString;
	}


	static hexStringToBinaryString(hex){
		let finalString = '';

		for(let i=0;i<hex.length;i++){
			finalString += parseInt(hex[i], 16).toString(2).padStart(4,0);
		}
		return finalString.padStart(hex.length*4,0);
	}


//use this instead?
// 	Array.prototype.deleteElem = function(val) {
//     var index = this.indexOf(val); 
//     if (index >= 0) this.splice(index, 1);
//     return this;
// }; 
// var arr = ["orange","red","black","white"];
// var arr2 = arr.deleteElem("red");
	static deleteFromList(list,element){
		var index = list.indexOf(element);
		if (index > -1) {
  			list.splice(index, 1);
  			console.log(element  + ' deleted!');
		}else{
			console.log("nothing deleted!");
		}
	}


	static isDigit(char){
		return /\d/.test(char);
	}
	static _isPartOfNumber(char){
		return MyAlgs.isDigit(char) || char=='.';
	}

	//from https://www.w3resource.com/javascript-exercises/javascript-math-exercise-39.php
	//num is a number
	static thousands_separators(num)
	{
		var num_parts = num.toString().split(".");
		num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		return num_parts.join(".");
	}

	

	//returns{match,lowIndex,highIndex} or null if a matching pattern is not over the sourceIndex
	static getRegexAtIndex(regex,text,sourceIndex){
		var match;
	    let iterations = 0;////////delete safety net later
	    while (((match = regex.exec(text))!==null)&&iterations<200) {
	        if(sourceIndex<match.index){//optimazation
	        	return null;
	        }
	        if(sourceIndex>=match.index && sourceIndex<regex.lastIndex){
	        	return {'match':match[0],'lowIndex':match.index,'highIndex':regex.lastIndex-1};
	        }
	        iterations++;
	    }
	    return null;
	}

	static getSpouse(char){
		const forwardPairing = {'(':')','[':']','{':'}','<':'>'};
		const backwardPairing = {')':'(',']':'[','}':'{','>':'<'};

		if(forwardPairing[char]!=null){
			return forwardPairing[char];
		}else if(backwardPairing[char]!=null){
			return backwardPairing[char];
		}else{
			return '';
		}
	}

	//returns the index of the partner of the bracket found at indexOfTarget.
	//If target is not ()[]{}<> or there is no spouse, returns -1
	static getIndexOfSpouse(string,indexOfTarget){
		const forwardPairing = {'(':')','[':']','{':'}','<':'>'};
		const backwardPairing = {')':'(',']':'[','}':'{','>':'<'};

		const target = string[indexOfTarget];

		let open;
		let close;
		let forwards;
		let spouse;

		if(forwardPairing[target]!=null){
			open = target;
			close = forwardPairing[target];
			forwards = true;
			spouse = close;
		}else if(backwardPairing[target]!=null){
			open = backwardPairing[target];
			close = target;
			forwards = false;
			spouse = open;
		}else{
			//target is not a bracket
			return -1;
		}

		let advanceBy = forwards?1:-1;

		let currentIndex = indexOfTarget;
		let depth = 1;
		while(true){
			currentIndex+=advanceBy;
			if(currentIndex<0 || currentIndex>=string.length){
				return -1;
			}
			if(string[currentIndex]==target){
				depth++;
			}else if(string[currentIndex]==spouse){
				depth--;
			}

			if(depth==0){
				return currentIndex;
			}
		}


	}

	static replaceBetweenIndexies(originalText,lowIndex,highIndex,stringToInsert){
		return originalText.substring(0,lowIndex) + stringToInsert + originalText.substring(highIndex+1,originalText.length);
	}

	//////not perfected
	// static numberToDecString(number){
	// 	if(Math.abs(number)>1){
	// 		return number.toFixed(14).replace(/\.?0+$/,'');
	// 	}else{
	// 		return number.toPrecision(14).replace(/\.?0+$/,'');
	// 	}
		
	// }

	//from https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
	//https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard
	static _fallbackCopyTextToClipboard(text) {
	  var textArea = document.createElement("textarea");
	  textArea.value = text;
	  textArea.style.position="fixed";  //avoid scrolling to bottom
	  document.body.appendChild(textArea);
	  textArea.focus();
	  textArea.select();

	  try {
	    var successful = document.execCommand('copy');
	    var msg = successful ? 'successful' : 'unsuccessful';
	    console.log('Fallback: Copying text command was ' + msg);
	  } catch (err) {
	    console.error('Fallback: Oops, unable to copy', err);
	  }

	  document.body.removeChild(textArea);
	}
	static copyTextToClipboard(text){
	  if (!navigator.clipboard) {
	    MyAlgs._fallbackCopyTextToClipboard(text);
	    return;
	  }
	  navigator.clipboard.writeText(text).then(function() {
	    console.log('Async: Copying to clipboard was successful!');
	  }, function(err) {
	    console.error('Async: Could not copy text: ', err);
	  });
	}

	static clipboardReadPermissionGranted = false;
	static readTextFromKeyBoard(doOnFinish){
		if(!MyAlgs.clipboardReadPermissionGranted){/////this part not working still asks every time
			navigator.permissions.query({name: "clipboard-read"}).then(permissionStatus => {
			  // If permission to read the clipboard is granted or if the user will
			  // be prompted to allow it, we proceed.

			  if (permissionStatus.state == "granted" || permissionStatus.state == "prompt") { //   
			    console.log('clipboard read permission: ',permissionStatus.state);
			    MyAlgs.clipboardReadPermissionGranted = true;
			    MyAlgs.readTextFromKeyBoard(doOnFinish);//recursion. will act normally now that clipboardReadPermissionGranted is true
			  }

			});
			
			
			return;
		}

		navigator.clipboard.readText()
		  .then(text => {
		    console.log('Pasted content: ', text);
		    doOnFinish(text);
		  })
		  .catch(err => {
		    console.error('Failed to read clipboard contents: ', err);
		  });


		// navigator.clipboard.read().then(data => {
	 //      for (let i=0; i<data.items.length; i++) {
	 //        if (data.items[i].type != "text/plain") {
	 //          alert("Clipboard contains non-text data. Unable to access it.");
	 //        } else {
	 //          let clipboardText = data.items[i].getAs("text/plain");
	 //          doOnFinish(clipboardText);
	 //        }
	 //      }
	 //    });
	}

//   https://stackoverflow.com/questions/7310559/the-best-way-to-remove-array-element-by-value
// 	arr = ["orange","red","black","white","red"]

// arr = arr.filter(val => val !== "red");

// console.log(arr) // ["orange","black","white"]



//arr = arr.filter(obj => obj.prop !== "red");

}