"use strict";
//////use cache for reading the same file multiple times?

//use example:
// let self = this;
// MyFileReader.readFile(filePath,function(fileText){
// 	let lines = fileText.split('\n');
//  lines.forEach(function(line){

//  });
//	self.finishedLoading = true;
// });
class MyFileReader{
	//doWithContentsFunc(file text)
	//async: true: does doWithContentsFunc later when the file is loaded.  false: does syncronously (slow, as it has to wait for the file)
	static readFile(filePath,doWithContentsFunc,async=true){
		let self=this;
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {// readyState==4: document is ready to parse. txtFile.status === 200 // file is found
				doWithContentsFunc(this.responseText);//this.responseText: reads the whole file as one string
			}
		};
		xhttp.open("GET", filePath, async);
		xhttp.send();
	}


//using https://stackoverflow.com/questions/21012580/is-it-possible-to-write-data-to-file-using-only-javascript
//usage: MyFileReader.downloadFile('name.extension',fileDataString);
	static downloadFile(fileName,textInFile){
		var data = new Blob([textInFile], {type: 'text/plain'});

		//href for the file
		let textFile = window.URL.createObjectURL(data);

		//make link
		var link = document.createElement('a');
	    link.setAttribute('download', fileName);
	    link.href = textFile;
	    document.body.appendChild(link);


	    //wait for the link to be added to the document
	    window.requestAnimationFrame(function () {
	      var event = new MouseEvent('click');
	      link.dispatchEvent(event);
	      document.body.removeChild(link);
	    });
	}
}