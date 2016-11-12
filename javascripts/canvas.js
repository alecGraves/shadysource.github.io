/**************************************************************
 * This code was adapted from a tutorial by William Malone
 *  explaining how to make a javascript drawing app.
 * The purpose of this project is to create a javascript app
 *  to speed up the labeling of picture data.
 **************************************************************/
var debug = false;

if (debug) console.log("canvas loaded.");

context = document.getElementById('canvasInAPerfectWorld').getContext("2d");

//on mouse click in canvas
$('#canvas').mousedown(function(e){
        if(debug) console.log("mousedown");
        var mouseX = e.pageX - this.offsetLeft;
        var mouseY = e.pageY - this.offsetTop;  
        paint = true;
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
        redraw();
    }
);

//on mouse movement in canvas
$('#canvas').mousemove(function(e){
        if (debug) console.log("mousemove");
        if(paint){
            addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
            redraw();
        }
    }
);

//mouse unclick action
$('#canvas').mouseup(function(e){
        if (debug) console.log("mouseup");
        paint = false;
    }
);

//mouse leaves the canvas
$('#canvas').mouseleave(function(e){
        if (debug) console.log("mouseleave");
        paint = false;
    }
);

var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;

function addClick(x, y, dragging){
    if (debug) console.log("click added")
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
}

function redraw(){
    if(debug) console.log("redraw triggered");
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

    context.strokeStyle = "#df4b26";
    context.lineJoin = "round";
    context.lineWidth = 5;
            
    for(var i=0; i < clickX.length; i++){		
        context.beginPath();
        if(clickDrag[i] && i){
                context.moveTo(clickX[i-1], clickY[i-1]);
            }else{
                context.moveTo(clickX[i]-1, clickY[i]);
            }
            context.lineTo(clickX[i], clickY[i]);
            context.closePath();
            context.stroke();
    }
}