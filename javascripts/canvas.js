/**************************************************************
 * This code was adapted from a tutorial by William Malone
 *  explaining how to make a javascript drawing app.
 * The purpose of this project is to create a javascript app
 *  to speed up the labeling of picture data.
 **************************************************************/
context = document.getElementById('dataCanvas').getContext("2d");

var clickX = new Array();
var clickY = new Array();
var clickColor = new Array();
var clickDrag = new Array();
var idx = 0;

var paint;


//colors
var buoyRed = "#d10c0c";
var buoyGreen = "#028c0e";
var buoyYellow = "#e6f727";
var pathMarkerBrown = "#441a04";
var startGateOrange = "#ff6614";

var curColor = buoyRed;
var image = newImage();
var curImgId = 0;

//on mouse click in canvas
$("#dataCanvas").mousedown(function(e){
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;  
    paint = true;
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    redraw();
    }
);

//on mouse movement in canvas
$("#dataCanvas").mousemove(function(e){
    if(paint){
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        redraw();
    }
});

//mouse unclick action
$("#dataCanvas").mouseup(function(e){
    paint = false;
});

//mouse leaves the canvas
$("#dataCanvas").mouseleave(function(e){
    paint = false;
});

$("#clearButton").click(function(){
    //context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.drawImage(img, 0, 0, context.canvas.width, context.canvas.height);
    resetVars();
    getLabel();
});

function addClick(x, y, dragging){
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
    clickColor.push(curColor);
}

function redraw(){
    context.lineJoin = "round";
    context.lineWidth = 5;
    
    for(var i=idx; i < clickX.length; i++){		
        context.beginPath();
        if(clickDrag[i] && i){
                context.moveTo(clickX[i-1], clickY[i-1]);
            }else{
                context.moveTo(clickX[i]-1, clickY[i]);
            }
            context.lineTo(clickX[i], clickY[i]);
            context.closePath();
            context.strokeStyle = clickColor[i];
            context.stroke();
    }

    idx = clickX.length;
}

function newImage(){
    img = new Image();
    img.onload = function(){
        return img;
    }
    img.src = 'example.com/ex.jpg';

    //Wait for image to finish loading

}

function resetVars(){
    idx = 0;
    clickX = new Array();
    clickY = new Array();
    clickColor = new Array();
    clickDrag = new Array();
}

function getLabel(){

}

/*function getLabel(){
    //resize the image
    context.drawImage(img, 0, 0, context.canvas.width*0.2, context.canvas.height*0.2);
    var imgData = context.getImageData(0,0,context.canvas.width*0.2,context.canvas.width*0.2);
    var data = imgData.data;
    var label = new Uint8Array();
    for(var i=0; i<data.length; i+=4){
        var red = data[i];
        var green = data[i+1];
        var blue = data[i+2];
        var alpha = data[i+3];
        var hex = rgbToHex(red, green, blue)
        if (hex == buoyRed){
            label.push(1);
        }
        else if (hex == buoyGreen){
            label.push(2);
        }
        else if (hex == buoyYellow){
            label.push(3);
        }
        else if (hex == pathMarkerBrown){
            label.push(4);
        }
        else if (hex == startGateOrange){
            label.push(5);
        }
        else{
            label.push(0);
        }
    }
    console.log(label);
    return label;
}*/

function rgbToHex(R,G,B){
    return toHex(R)+toHex(G)+toHex(B)
}

function toHex(n) {
    n = parseInt(n,10);
    if (isNaN(n)) return "00";
    n = Math.max(0,Math.min(n,255));
    return "0123456789ABCDEF".charAt((n-n%16)/16)
        + "0123456789ABCDEF".charAt(n%16);
}