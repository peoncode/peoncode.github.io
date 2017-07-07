
// Copyright 2010 William Malone (www.williammalone.com)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var canvas;
var context;
var canvasWidth;
var canvasHeight;
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint = false;
var curColor = "#cb3594";
var curSize = "small";

/**
* Calls the redraw function after all neccessary resources are loaded.
*/
function resourceLoaded()
{
	redraw();
}

/**
* Creates a canvas element, loads images, adds events, and draws the canvas for the first time.
*/
function prepareCanvas()
{
	// Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
	// var canvasDiv = document.getElementById('canvasDiv');
	// canvas = document.createElement('canvas');
	// canvas.setAttribute('width', canvasWidth);
	// canvas.setAttribute('height', canvasHeight);
	// canvas.setAttribute('id', 'canvas');
 //  canvas.setAttribute('style', 'border-style:solid; border-width:1px');
	// canvasDiv.appendChild(canvas);
	canvasWidth = this.innerWidth-30;
	canvasHeight = this.innerHeight-30;
	canvas = document.getElementById('canvas');
	canvas.setAttribute('width', canvasWidth);
	canvas.setAttribute('height', canvasHeight);
	context = canvas.getContext("2d");
  context.lineJoin = "round";
  context.lineWidth = 2;

	// Add mouse events
	// ----------------
	$('#canvas').on('mousedown touchstart', function(e)
	{
		// Mouse down location
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;
		
		paint = true;
		addClick(mouseX, mouseY, false);
		redraw();
	});
	
	$('#canvas').on('mousemove touchmove', function(e){
		if(paint==true){
			addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
			redraw();
		}
	});
	
	$('#canvas').on('mouseup touchend', function(e){
		paint = false;
	  redraw();
	});
	
	$('#canvas').on('mouseleave touchend', function(e){
		paint = false;
	});

  $('#canvas').on('dblclick doubletap', function(e){
    clearCanvas();
    clickX = new Array();
    clickY = new Array();
    clickDrag = new Array();
  });
	
$('#canvas').focus();
}

/**
* Adds a point to the drawing array.
* @param x
* @param y
* @param dragging
*/
function addClick(x, y, dragging)
{
	clickX.push(x);
	clickY.push(y);
	clickDrag.push(dragging);
}

/**
* Clears the canvas.
*/
function clearCanvas()
{
	context.clearRect(0, 0, canvasWidth, canvasHeight);
}

/**
* Redraws the canvas.
*/
function redraw()
{
	clearCanvas();
	
	// Keep the drawing in the drawing area
	context.save();
	context.beginPath();
	context.rect(0, 0, canvasWidth, canvasHeight);
	context.clip();
		
	var i = 0;
	for(; i < clickX.length; i++)
	{		
		context.beginPath();
		if(clickDrag[i] && i){
			context.moveTo(clickX[i-1], clickY[i-1]);
		}else{
			context.moveTo(clickX[i], clickY[i]);
		}
		context.lineTo(clickX[i], clickY[i]);
		context.closePath();		
    context.strokeStyle = curColor;
		context.stroke();
	}
	context.restore();
}


/**/
