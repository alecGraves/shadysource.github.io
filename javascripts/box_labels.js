/**************************************************************
 * This code was adapted from a tutorial by William Malone
 *  explaining how to make a javascript drawing app.
 * I would like to thank the internet for helping me do this.
 * The purpose of this project is to create a javascript app
 *  to speed up the labeling of picture data.
 * 
 * required document at "https://raw.githubusercontent.com/shadySource/DATA/master/underwater/url.txt"
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
var pathMarkerBrown = "#441a04";
var startGateOrange = "#ff6614";
var octogonBlk = "#0a0807";

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
labels.push("Number of labels: 0");

// var info = "";
// var infoSet = false;

$(window).on("load",function() {

document.getElementById("numLabels").innerHTML = labels[0]+ "\t\tCurrent Dataset: " + dataset.toString()+ "\tImage: "+imageIdx.toString();
context = document.getElementById('pictureCanvas').getContext("2d");

$.get(imageURLFile,function(data){
    imageURLs = data.split("\n");
    newImage();


// Get datasets and add them to the dropdown menu
dropdown = document.getElementById("dataList");
datasets = imageURLs[0].split(' ');
for(var i = 0; i < datasets.length; i++){
    var lin = document.createElement("a");
    lin.setAttribute("href","#");
    lin.setAttribute("id","dataset" + i.toString());
    var node = document.createTextNode(datasets[i]);
    lin.appendChild(node);
    dropdown.appendChild(lin);
    dropdownCB(i);
}

function dropdownCB(i){
    $("#dataset" + i.toString()).click(function(){
        dataset = i;
        newImage();
        resetVars();
        document.getElementById("numLabels").innerHTML = labels[0] + "\t\tCurrent Dataset: " + dataset.toString() + "\tImage: "+imageIdx.toString();
    });
}

$("#datbtn").click(function(){document.getElementById("dataList").classList.toggle("show");});


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
            clickColor.pop()
            paint = false;
            return false;
        }
    });

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
$("#OCTbtn").click(function(){curColor = octogonBlk});

$("#submitButton").click(function(){
    labels.push(getLabel());
    if(labels[labels.length-1]=="EMPTY")
        labels.pop();
    labels[0] = "Number of labels: " + (labels.length-1).toString();
    document.getElementById("numLabels").innerHTML = labels[0] + "\t\tCurrent Dataset: " + dataset.toString() + "\tImage: "+imageIdx.toString();
});

$("#unSubmitButton").click(function(){
    if (labels.length > 1)
        labels.pop();
    labels[0] = "Number of labels: " + (labels.length-1).toString();
    document.getElementById("numLabels").innerHTML = labels[0] + "\t\tCurrent Dataset: " + dataset.toString() + "\tImage: "+imageIdx.toString();
});

$("#newImageButton").click(function(){
    newImage();
    resetVars();
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
    var d = new Date();
    var filename = "DATA" + d.getFullYear().toString() + "y" + d.getMonth().toString() + "m" + d.getDate().toString() 
                + "d" + d.getHours().toString() + "h" + d.getMinutes().toString() + "m" + d.getSeconds().toString()
                + "s" + d.getMilliseconds().toString();
    var labelsString = "";
    for (i = 0; i < labels.length; i++)
        labelsString = labels[i];
    var blob =  new Blob([labelsString],{type: "text/plain;charset=utf-8"});
    if (labels.length > 1)
        saveAs(blob, filename);
    //cool, but not necesary
    //$("#abortButton").click(function(){filesaver.abort();});
    tmpLabels = new Array();
    labels = new Array();
    labels.push("Number of labels: 0");
    document.getElementById("numLabels").innerHTML = labels[0] + + "\t\tCurrent Dataset: " + dataset.toString();
});

$("#emailButton").click(function(){
    var name = $('#nameBox').val();
    if (name == "")
        name = "AnonymousUser";
    document.location = "mailto:shadysourcebot@gmail.com"+"?subject="+"DATA"+"&body="+"Hello shadySourceBot,\n\nI have a contribution to make!!\n\nSincerely,\n"+name;
    //seriously, I did this for science. dont be a dick.
});

function redraw(ctx){
    context.drawImage(image, 0, 0, context.canvas.width, context.canvas.height);
    ctx.lineJoin = "round";
    ctx.lineWidth = 5;
    for(var i=0; i < clickX.length; i+=2){
        ctx.beginPath()
        // console.log(clickX[i], clickY[i], clickX[i+1]-clickX[i], clickY[i+1]-clickY[i]);
        ctx.rect(clickX[i], clickY[i], clickX[i+1]-clickX[i], clickY[i+1]-clickY[i]);
        ctx.strokeStyle = clickColor[i/2];
        ctx.stroke();
    }

}

function newImage(){
    urls = imageURLs[dataset + 1].split(' ');
    if(imageIdx != urls.length-1){
        imageIdx += 1;
    }else{
        imageIdx = Math.floor((Math.random() * urls.length));
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
    idx = 0;
    clickX = new Array();
    clickY = new Array();
    clickColor = new Array();
}

function getLabel(){
    //create label:
    var label = curImgURL + "\n";
    len = clickX.length
    if(len<2)
        return "EMPTY";
    for(var i = 0; i < len; i+=2){
        label += nameColor(clickColor[i/2]) + ' ';
        label += clickX[i].toString() + ' ';
        label += clickY[i].toString() + ' ';
        label += clickX[i+1].toString() + ' ';
        label += clickY[i+1].toString() + '\n';
    }
    return label + "\n\n";
}

function nameColor(color){
    if (color === buoyRed) return "red_buoy";
    else if (color === buoyGreen) return "green_buoy";
    else if (color === buoyYellow) return "yellow_buoy";
    else if (color === pathMarkerBrown) return "path_marker";
    else if (color === startGateOrange) return "start_gate";
    else if (color === octogonBlk) return "octogon";
}

});

});