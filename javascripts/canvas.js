/**************************************************************
 * This code was adapted from a tutorial by William Malone
 *  explaining how to make a javascript drawing app.
 * The purpose of this project is to create a javascript app
 *  to speed up the labeling of picture data.
 **************************************************************/
context = document.getElementById('pictureCanvas').getContext("2d");

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
var image;
var curImgId = 0;
var imageIDs = new Array();

var tmpLabel;
var labels = new Array();

newImage();

//on mouse click in canvas
$("#pictureCanvas").mousedown(function(e){
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;  
    paint = true;
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    redraw(context);
    }
);

//on mouse movement in canvas
$("#pictureCanvas").mousemove(function(e){
    if(paint){
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        redraw(context);
    }
});

//mouse unclick action
$("#pictureCanvas").mouseup(function(e){
    paint = false;
});

//mouse leaves the canvas
$("#pictureCanvas").mouseleave(function(e){
    paint = false;
});

$("#clearButton").click(function(){
    context.drawImage(image, 0, 0, context.canvas.width, context.canvas.height);
    resetVars();
});

$("#submitButton").click(function(){
    labels.push(getLabel());
    context.drawImage(image, 0, 0, context.canvas.width, context.canvas.height);
    resetVars();
});

$("#unSubmitButton").click(function(){
    tmpLabel = labels.pop();
    context.drawImage(image, 0, 0, context.canvas.width, context.canvas.height);
    resetVars();
});

function addClick(x, y, dragging){
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
    clickColor.push(curColor);
}

function redraw(ctx){
    ctx.lineJoin = "round";
    ctx.lineWidth = 5;
    
    for(var i=idx; i < clickX.length; i++){		
        ctx.beginPath();
        if(clickDrag[i] && i){
                ctx.moveTo(clickX[i-1], clickY[i-1]);
            }else{
                ctx.moveTo(clickX[i]-1, clickY[i]);
            }
            ctx.lineTo(clickX[i], clickY[i]);
            ctx.closePath();
            ctx.strokeStyle = clickColor[i];
            ctx.stroke();
    }

    idx = clickX.length;
}

function newImage(){
    var newImg = new Image();
    newImg.src = 'https://github.com/shadySource/DATA/raw/master/neuron.jpg';
    newImg.onload = function(){
        image = newImg;
        context.drawImage(image, 0, 0, context.canvas.width, context.canvas.height);
    }
}

function resetVars(){
    idx = 0;
    clickX = new Array();
    clickY = new Array();
    clickColor = new Array();
    clickDrag = new Array();
}


function getLabel(){
    datacontext = createNewContext(context.canvas.width, context.canvas.height);
    //clear image and reset index, them redraw
    idx = 0;
    redraw(datacontext);
    //resize the image
    var tmpImg = getCanvasImg(datacontext),
        newWidth = context.canvas.width*0.2,
        newHeight = context.canvas.height*0.2;
    datacontext.clearRect(0, 0, newWidth, newHeight)
    datacontext.drawImage(tmpImg, 0, 0, newWidth, newHeight);
    var imgData = datacontext.getImageData(0, 0, newWidth, newHeight);
    var data = imgData.data;
    var label = new Uint8Array(data.length/4);
    for(var i=0; i<data.length; i+=4){
        var red = data[i];
        var green = data[i+1];
        var blue = data[i+2];
        var hex = rgbToHex(red, green, blue)
        if (hex == buoyRed){
            label[i] = 1;
        }
        else if (hex == buoyGreen){
            label[i] = 2;
        }
        else if (hex == buoyYellow){
            label[i] = 3;
        }
        else if (hex == pathMarkerBrown){
            label[i] = 4;
        }
        else if (hex == startGateOrange){
            label[i] = 5;
        }
        else{
            label[i] = 0;
        }
    }
    return label;
}

function createNewContext(width, height) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas.getContext("2d");
}

function getCanvasImg(ctxt){
    var canvasImage = new Image();
    canvasImage.src = ctxt.canvas.toDataURL();
    canvasImage.onload = function(){
        return canvasImage;
    //return canvasImage.onload
    };
    return canvasImage.onload();
}

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
