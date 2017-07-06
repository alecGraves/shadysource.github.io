/**************************************************************
 * This code was adapted from a tutorial by William Malone
 *  explaining how to make a javascript drawing app.
 * I would like to thank the many people of the internet 
 *  for helping me on this journey.
 * The purpose of this project is to create a javascript app
 *  to speed up the labeling of picture data.
 * 
 * required document at "https://raw.githubusercontent.com/shadySource/DATA/master/url.txt"
 *     needs format of: 
 *     dataset1 dataset2 ... datasetN
 *     <dataset1 URLs seperated by ' '>
 *     <dataset2 URLs seperated by ' '>
 *     ...
 *     <datasetN URLs seperated by ' '>
 **************************************************************/
var context;

var clickX = new Array();
var clickY = new Array();
var clickColor = new Array();

var paint;

//colors
var buoyRed = "#d10c0c";
var buoyGreen = "#028c0e";
var buoyYellow = "#e6f727";
var pathMarkerBrown = "#f4a460";
var startGateOrange = "#ff6614";
var channelBlk = "#0a0807";

var curColor = buoyRed;
var image;
var curImgURL = "";
var imageURLFile = "https://raw.githubusercontent.com/shadySource/DATA/master/url.txt";
var imageURLs = new Array();
var dataset = 0;
var imageIdx = 0;
var imageSet = false;

var tmpLabel;
var labels = new Array();


function updateDescription(){
    document.getElementById("canvasDescription").innerHTML = "Number of labels: "+labels.length.toString()+"\t\tCurrent Dataset: "+dataset.toString()+"\tImage: "+imageIdx.toString();
}

$(window).on("load",function() {

updateDescription();

context = document.getElementById('pictureCanvas').getContext("2d");

$.get(imageURLFile,function(data){
    imageURLs = data.split("\n");
    newImage(false);


// Get datasets and add them to the dropdown menu
dropdown = document.getElementById("dataList");
datasets = imageURLs[0].split(' ');
for(var i = 0; i < datasets.length; i++){
    var lin = document.createElement("a");
    lin.setAttribute("href","#data-labeling");
    lin.setAttribute("id","dataset" + i.toString());
    var node = document.createTextNode(datasets[i]);
    lin.appendChild(node);
    dropdown.appendChild(lin);
    dropdownCB(i);
}

function dropdownCB(i){
    $("#dataset" + i.toString()).click(function(){
        document.getElementById("dataBtn").click()
        dataset = i;
        imageIdx = 0;
        newImage(false);
        resetVars();
        updateDescription();
    });
}

$("#dataBtn").click(function(){document.getElementById("dataList").classList.toggle("show");});


function enableDrawing(){
    //on mouse click in canvas
    $("#pictureCanvas").mousedown(function(e){
        paint = true;
        clickY.push(e.pageY - this.offsetTop);
        clickX.push(e.pageX - this.offsetLeft);
        clickColor.push(curColor);
        return false;
        }
    );

    //on mouse movement in canvas
    $("#pictureCanvas").mousemove(function(e){
        if(paint){
            clickX.push(e.pageX - this.offsetLeft);
            clickY.push(e.pageY - this.offsetTop);
            redraw(context);
            clickX.pop();
            clickY.pop();
            return false;
        }
    });

    //mouse unclick action
    $("#pictureCanvas").mouseup(function(e){
        if(paint){
            clickY.push(e.pageY - this.offsetTop);
            clickX.push(e.pageX - this.offsetLeft);
            redraw(context);
            paint = false;
            return false;
        }
    });

    //mouse leaves the canvas
    $("#pictureCanvas").mouseleave(function(e){
        if(paint){
            clickX.pop();
            clickY.pop();
            clickColor.pop();
            paint = false;
            redraw(context);
            return false;
        }
    });

    $("#undoButton").click(function(){
        clickX.pop();
        clickY.pop();
        clickX.pop();
        clickY.pop();
        clickColor.pop();
        redraw(context);
    })

    $("#clearButton").click(function(){
        context.drawImage(image, 0, 0, context.canvas.width, context.canvas.height);
        resetVars();
    });
}

$("#bRBtn").click(function(){curColor = buoyRed});
$("#bGBtn").click(function(){curColor = buoyGreen});
$("#bYBtn").click(function(){curColor = buoyYellow});
$("#PMBtn").click(function(){curColor = pathMarkerBrown});
$("#SGBtn").click(function(){curColor = startGateOrange});
$("#CHANbtn").click(function(){curColor = channelBlk});

$("#submitButton").click(function(){
    tmpLabel = getLabel();
    if(tmpLabel != "EMPTY"){
        labels.push(tmpLabel)
    }
    newImage();
    resetVars();
    updateDescription();
});

$("#unSubmitButton").click(function(){
    labels.pop();
    updateDescription();
});

$("#newImageButton").click(function(){
    newImage();
    resetVars();
    updateDescription();
});

//cool, but unnecessary
/*$("#reSubmitButton").click(function(){
    if (tmpLabels.length > 0)
        labels.push(tmpLabels.pop());
    labels[0] = "Number of labels: " + (labels.length-1).toString();
    document.getElementById("numLabels").innerHTML = labels[0];
    resetVars();
});*/

$("#downloadButton").click(function(){
    if (labels.length > 0){
        var d = new Date();
        var filename = "DATA" + d.getFullYear().toString() + "y" + d.getMonth().toString() + "m" + d.getDate().toString() 
                    + "d" + d.getHours().toString() + "h" + d.getMinutes().toString() + "m" + d.getSeconds().toString()
                    + "s" + d.getMilliseconds().toString();
        var labelsString = labels[0];
        for (i = 1; i < labels.length; i++)
            labelsString += "\n\n" + labels[i];
        var blob =  new Blob([labelsString],{type: "text/plain;charset=utf-8"});
        saveAs(blob, filename);
        //cool, but not necesary
        //$("#abortButton").click(function(){filesaver.abort();});
        tmpLabels = new Array();
        labels = new Array();
        updateDescription();
}});

$("#emailButton").click(function(){
    var name = $('#nameBox').val();
    if (name == "")
        name = "AnonymousUser";
    document.location = "mailto:shadysourcebot@gmail.com"+"?subject="+"DATA"+"&body="+"Hello shadySourceBot,\n\nI have a contribution to make!!\n\nSincerely,\n"+name;
    //seriously, I did this for science. dont be a dick :p.
});

function redraw(ctx){
    context.drawImage(image, 0, 0, context.canvas.width, context.canvas.height);
    ctx.lineJoin = "round";
    ctx.lineWidth = 1;
    for(var i=0; i < clickX.length; i+=2){
        ctx.beginPath()
        // console.log(clickX[i], clickY[i], clickX[i+1]-clickX[i], clickY[i+1]-clickY[i]);
        ctx.rect(clickX[i], clickY[i], clickX[i+1]-clickX[i], clickY[i+1]-clickY[i]);
        ctx.strokeStyle = clickColor[i/2];
        ctx.stroke();
    }

}

function newImage(incriment=true){
    urls = imageURLs[dataset + 1].split(' ');
    if(incriment){ // only incriment if not the first image.
        imageIdx = (imageIdx + 1) % urls.length
    }
    var newImg = new Image();
    newImg.onload = function(){
        image = newImg;
        curImgURL = urls[imageIdx];
        context.drawImage(image, 0, 0, context.canvas.width, context.canvas.height);
        if (imageSet === false){
            enableDrawing();
            imageSet = true;
        }
    }
    newImg.src = urls[imageIdx];
}

function resetVars(){
    clickX = new Array();
    clickY = new Array();
    clickColor = new Array();
}

function getLabel(){
    //create label:
    len = clickX.length
    if(len<2)
        return "EMPTY";
    var label = curImgURL;
    for(var i = 0; i < len; i+=2){
        label += '\n' + nameColor(clickColor[i/2]) + ' ';
        label += clickX[i].toString() + ' ';
        label += clickY[i].toString() + ' ';
        label += clickX[i+1].toString() + ' ';
        label += clickY[i+1].toString();
    }
    return label;
}

function nameColor(color){
    if (color === buoyRed) return "red_buoy";
    else if (color === buoyGreen) return "green_buoy";
    else if (color === buoyYellow) return "yellow_buoy";
    else if (color === pathMarkerBrown) return "path_marker";
    else if (color === startGateOrange) return "start_gate";
    else if (color === channelBlk) return "channel";
}

});

});
