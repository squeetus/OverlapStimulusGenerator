/*
 *
 *  Global Variables
 *
 */
// attributes of the canvas area
var width = 500,
    height = 500,
    center = [width/2, height/2];

// number of shapes in categories 1 and 2
var numShapes = 20;
var numShapes2 = 80;

var currSymbol = 1, symbol1 = dot, symbol2 = dot;

// in mode 1, we have one svg. in mode 2, we have two svgs.
var mode = 1;

// which positions/shapes/svg are we modifying? 1 or 2
var which = 1;

// radius of bounding circle in pixels
// bcr = 8 yields 0.4043 degrees visual angle for diameter of bounding circle
var bcr = 8;

// the rotation of svg 1 and 2
var svgRotation = 0;
var svgRotation2 = 0;


// canvas area 1
var svg = d3.select("#display")
              .attr("width", width)
              .attr("height", height)
              .style("border", "solid 2px black");

// canvas area 2
var svg2 = d3.select("#display2")
              .attr("width", width)
              .attr("height", height)
              .style("border", "solid 2px black")
              .style("display", "none");


// swap between single and double window
function toggleLayout() {
  if(mode == 1) {
    svg2.style("display", "inline");
    mode = 2;
  } else if(mode == 2) {
    svg2.style("display", "none");
    mode = 1;
  }
}

// helper function to highlight the current selected svg element
function flashBorder() {
  sv = (which == 1) ? svg : svg2;
  sv
    .transition()
    .duration(150)
    .style("border", "solid 2px red")
    .transition()
    .duration(150)
    .style("border", "solid 2px black");
}

function toggleWhich() {
  which = (which == 1) ? 2 : 1;

  flashBorder();
}


function toggleShape() {
  currSymbol = (currSymbol == 1) ? 2 : 1;

  console.log('modifying symbol', currSymbol);
}

function modifySymbol(s) {
  if(currSymbol == 1) {
    symbol1 = s;
  } else if(currSymbol == 2) {
    symbol2 = s;
  }
  redrawSymbols();
}

function redrawSymbols() {
  drawNumerosityTogether(getPositions(), symbol1, numShapes, symbol2, numShapes2);
}

// set of shape positions
var shapes, shapes2;
shapes = svg.selectAll(".shape");

shapes2 = svg2.selectAll(".shape");





function drawNumerosityTogether(positions, symbol, count, symbol2, count2) {
  // get 100 positions with a specific amount of overlap among symbols
  // var positions = getOverlapDistribution(count + count2);

  // let s = (which == 1) ? shapes : shapes2;
  let sv = svg;
  let rotate = svgRotation;

  // keep track of how many of each type have been drawn
  let drawn = 0, drawn2 = 0;

  sv.selectAll(".shapecontainer").remove();
  s = sv.selectAll(".shape")
          .data([...Array(positions.length).keys()])
          .enter().append("g")
            .classed("shapecontainer", true)
            .attr('transform', function(d, i) {
              return 'translate(' +  positions[i][0] + ',' +
              positions[i][1] + ') rotate(' + (-rotate)  + ' 0 0)';
            });
  s.append("path")
    // .attr("class", function(d, i) {
    //   if(mode == 1) {
    //     return i % 2 === 0 ? getName(symbol) : getName(symbol2);
    //   }
    //   else return getName(symbol);
    // })
    .classed("shape", true)
    .attr("id", function(d, i) { return i; })
    .attr("d", function(d, i) {
      if(i % 2 == 0) { // even positions are symbol1
        if(drawn < count) {
          drawn++;
          return symbol();
        } else {
          return symbol2();
        }
      } else {
        if(drawn2 < count2) {
          drawn2++;
          return symbol2();
        } else {
          return symbol();
        }
      }
    })
    .style("stroke", "black")
    .style("fill", "none")
    .style("fill-opacity", 1)
    .style("opacity", 1);

  sv.selectAll(".shapecontainer")
    .attr("transform", function(d,i) {
      var myXform = d3.select(this).attr("transform");
      return myXform.slice(0, myXform.indexOf("rotate")) + ' rotate(' + (-rotate)  + ' 0 0)';
    });
}







function drawNumerositySeparately(positions, symbol, count, symbol2, count2) {
  // let s = (which == 1) ? shapes : shapes2;
  let sv = (which == 1) ? svg : svg2;
  let rotate = (which == 1) ? svgRotation : svgRotation2;

  // keep track of how many of each type have been drawn
  let drawn = 0, drawn2 = 0;

  sv.selectAll(".shapecontainer").remove();
  s = sv.selectAll(".shape")
          .data([...Array(positions.length).keys()])
          .enter().append("g")
            .classed("shapecontainer", true)
            .attr('transform', function(d, i) {
              return 'translate(' +  positions[i][0] + ',' +
              positions[i][1] + ') rotate(' + (-rotate)  + ' 0 0)';
            });
  s.append("path")
    // .attr("class", function(d, i) {
    //   if(mode == 1) {
    //     return i % 2 === 0 ? getName(symbol) : getName(symbol2);
    //   }
    //   else return getName(symbol);
    // })
    .classed("shape", true)
    .attr("id", function(d, i) { return i; })
    .attr("d", function(d, i) {
      if(i % 2 == 0) { // even positions are symbol1
        if(drawn < count) {
          drawn++;
          return symbol();
        } else {
          return symbol2();
        }
      } else {
        if(drawn2 < count2) {
          drawn2++;
          return symbol2();
        } else {
          return symbol();
        }
      }
    })
    .style("stroke", "black")
    .style("fill", "none")
    .style("fill-opacity", 1)
    .style("opacity", 1);

  sv.selectAll(".shapecontainer")
    .attr("transform", function(d,i) {
      var myXform = d3.select(this).attr("transform");
      return myXform.slice(0, myXform.indexOf("rotate")) + ' rotate(' + (-rotate)  + ' 0 0)';
    });
}







/*
  Produce a set of positions with a specific amount of overlap:
  easy - 30%
  medium - 50%
  hard - 70%
*/
function getOverlapDistribution(num, desiredOverlap) {
  // if(!num) num = (which == 1) ? numShapes : numShapes2;
  var positions = [];
  // var anchorPositions = num/4;
  var x, y;
  if(!desiredOverlap) desiredOverlap = 0.2;
  var overlapThreshold = 4; // max number of overlaps for a new overlapping position

  // bounds of possible x and y coordinates (given width, height, and bcr)
  xRange = [
    (2*bcr) + 0.1*width,
    width-2*bcr - 0.1*width
  ];
  yRange = [
    2*bcr + 0.1*height,
    height-2*bcr - 0.1*height
  ];

  // randomly pick an anchor position
  function pickAnchor() {
    // return positions[Math.floor(Math.random()*anchorPositions)];
    return positions[Math.floor(Math.random()*positions.length)];
  }

  function placeAnchor() {

    x = randomFromInterval(xRange[0], xRange[1], 3);
    y = randomFromInterval(yRange[0], yRange[1], 3);

    while(!validAnchor([x, y])) {
      x = randomFromInterval(xRange[0], xRange[1], 3);
      y = randomFromInterval(yRange[0], yRange[1], 3);
    }

    return [x,y];
  }

  function placeOverlapper() {
      do {
        // pick an existing position to draw next to
        anchor = pickAnchor();

        // offsetx = randomFromInterval(anchor[0]-1.8*bcr, anchor[0] + 1.8*bcr);
        // offsety = randomFromInterval(anchor[1]-1.8*bcr, anchor[1] + 1.8*bcr);

        // pick an angle around the chosen anchor
        theta = randomFromInterval(0, 2*Math.PI);

        // pick a distance from the anchor (not too close or far)
        d = randomFromInterval(0.2*bcr*2, 0.8*bcr*2);

        // determine new coordinates from angle and distance
        dx = d * Math.cos(theta);
        dy = d * Math.sin(theta);

        x = anchor[0] + dx;
        y = anchor[1] + dy;

      } while(!validOverlapPoint([x, y]));

      return [x,y];
  }

  // is the point p([x, y]) in screen bounds?
  function inBounds(p) {
    // check bounds of display
    if((p[0]-2*bcr) <= 0 ||
      (p[0]+2*bcr) >= width ||
      (p[1]-2*bcr) <= 0 ||
      (p[1]+2*bcr) >= height) {
      console.log("out of bounds.");
      return false;
    }
    return true;
  }

  // does the point p([x, y]) overlap any other positions?
  function hasOverlap(p) {
    for(var i = 0; i < positions.length; i++) {
      // console.log(p, positions[i]);
      if((Math.abs(p[0] - positions[i][0]) < 2*bcr) &&
       (Math.abs(p[1] - positions[i][1]) < 2*bcr)){
         // console.log("TOOOO CLOSE", distance(positions[i], p));
        return true;
      }
    }
  }

  // anchor positions must be within bounds and must not overlap
  function validAnchor(p) {
    return inBounds(p) && !hasOverlap(p);
  }

  // determine whether a given point [x, y] is valid given the constraints
  //   of the specific overlap desired and the bounds of the display
  function validOverlapPoint(p) {

    if(!inBounds(p)) return false;

    // count any overlap with other symbols
    var overlaps = 0;
    for(var i = 0; i < positions.length; i++) {
      // if the overlap is too close, return false
      if((Math.abs(p[0] - positions[i][0]) < 0.5*bcr) &&
       (Math.abs(p[1] - positions[i][1]) < 0.5*bcr)){
         console.log('too close m8');
         return false;
       }

      // otherwise, count the number of overlaps
      if((Math.abs(p[0] - positions[i][0]) < 2*bcr) &&
       (Math.abs(p[1] - positions[i][1]) < 2*bcr)){

        overlaps++;
      }
    }

    return (overlaps < overlapThreshold);

    //return true;
  }

  // get [anchorPositions] random locations in the display
  // for(var i = 0; i < anchorPositions; i++) {
    positions.push(placeAnchor());
    console.log(positions);
  // }

  // add [num - anchorPositions] locations overlapping at least one current location.
  // for(var j = 0; j < (num-anchorPositions); j++) {
  for(var j = 0; j < (num-1); j++) {

    // randomly place next position with or without overlap
    if(Math.random() < desiredOverlap) {
      //  overlap:
      // console.log('overlap');
      positions.push(placeOverlapper());
    } else {
      // no overlap
      // console.log('no overlap');
      positions.push(placeAnchor()); // anchor positions can not overlap
    }
  }

  return positions;
}









/*
 *  Keypress Events
 */
document.addEventListener('keypress', (event) => {
  const keyName = event.key;

  switch(keyName) {
    case "1":
      modifySymbol(dot);
      break;
    case "2":
      modifySymbol(circle);
      // drawSymbols(circles);
      break;
    case "3":
      modifySymbol(pentagon);
      // drawSymbols(pentagon);
      break;
    case "4":
      modifySymbol(square);
      // drawSymbols(square);
      break;
    case "5":
      modifySymbol(triangle);
      break;
    case "6":
      modifySymbol(sixLine);
      // drawSymbols(sixLine);
      break;
    case "7":
      modifySymbol(fiveLine);
      // drawSymbols(fiveLine);
      break;
    case "8":
      modifySymbol(fourLine);
      // drawSymbols(fourLine);
      break;
    case "9":
      modifySymbol(threeLine);
      // drawSymbols(threeLine);
      break;
    case "c":
      computeOverlaps(getPositions());
      computeOverlapPercentage(getPositions());
      break;
    case "v":
      toggleLayout();
      break;
    case "b":
      toggleWhich();
      break;
    case "n":
      if(mode == 1) {
        drawNumerosityTogether(getOverlapDistribution(numShapes + numShapes2), symbol1, numShapes, symbol2, numShapes2);

        computeOverlaps(getPositions());
        computeOverlapPercentage(getPositions());
      } else {
        drawNumerositySeparately(symbol1, numShapes, symbol2, numShapes2);

        console.log("NOW DO IT");
      }


      break;
    case "s":
      toggleShape();
      break;
    case "z":
      rotateSVG();
      break;
    case "p":
      sendPositions();
      break;
  }

  // console.log('keypress event\n\n' + 'key: ' + keyName);
});
