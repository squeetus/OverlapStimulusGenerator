/*
 *
 *  Global Variables
 *
 */
// attributes of the canvas area
var width = 1100,
    height = 500,
    center = [width/2, height/2];

// // radius of bounding circle in pixels
// // bcr = 8 yields 0.4043 degrees visual angle for diameter of bounding circle
var bcr = 25;
var symbol = dot;
//

// canvas area 1
// var svg = d3.select("#display")
//               .attr("width", width)
//               .attr("height", height)
//               .style("border", "solid 2px black");
//
// // canvas area 2
// var svg2 = d3.select("#display2")
//               .attr("width", width)
//               .attr("height", height)
//               .style("border", "solid 2px black")
//               .style("display", "none");

var display = d3.select("#practiceShapes")
                      .attr("width", width)
                      .attr("height", height);


var g = display.selectAll(".item")
    .data(['a','s','d','f','j','k','l',';'])
    .enter().append('g');
g
  .attr("id", function(d, i) { return d == ';' ? 'p' : d; })
  .classed("practiceItem", true)
  .attr("transform", function(d,i) {
    var offset = i > 3 ? 150 : 50;
    return "translate(" + ((i * 125)+offset) + ", 200)";
  });

g
  .append('g')
  .attr("id", function(d, i) { return d == ';' ? 'shape-p' : "shape-"+d; });

g
  .append("text")
    .style("text-anchor", "middle")
    .attr("transform", "translate(0,100)")
    .text(function(d){ return d; });

/*
 *  Keypress Events
 */
document.addEventListener('keypress', (event) => {
  const keyName = event.key;

  switch(keyName) {
    case "1":
      symbol = dot;
      break;
    case "2":
      symbol = circle;
      // drawSymbols(circles);
      break;
    case "3":
      symbol = pentagon;
      // drawSymbols(pentagon);
      break;
    case "4":
      symbol = square;
      // drawSymbols(square);
      break;
    case "5":
      symbol = triangle;
      break;
    case "6":
      symbol = sixLine;
      // drawSymbols(sixLine);
      break;
    case "7":
      symbol = fiveLine;
      // drawSymbols(fiveLine);
      break;
    case "8":
      symbol = fourLine;
      // drawSymbols(fourLine);
      break;
    case "9":
      symbol = threeLine;
      // drawSymbols(threeLine);
      break;
    case "r":
      display.selectAll(".symbol").remove();
      break;
    case "a":
    case "s":
    case "d":
    case "f":
    case "j":
    case "k":
    case "l":
    case "p":
      d3.select("#shape-"+keyName).selectAll("*").remove();
      d3.select("#shape-"+keyName)
        .append("path")
        .attr("class", "symbol")
        .attr("d", function(d, i) {
            return symbol();
        })
        .style("stroke", "black")
        .style("stroke-width", "2px")
        .style("fill", "none")
        .style("fill-opacity", 1)
        .style("opacity", 1);
      break;
  }
  // console.log('keypress event\n\n' + 'key: ' + keyName);
});

// compute radians from degrees
function degToRad(deg) {
  return deg*0.01745329252;
}
