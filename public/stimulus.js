/*
 *
 *  Global Variables
 *
 */
// attributes of the canvas area
var width = 550,
    height = 550,
    center = [width/2, height/2];

// number of shapes in categories 1 and 2
var numShapes = 100;
var numShapes2 = 100;

var currSymbol = 1, symbol1 = dot, symbol2 = dot;

// in mode 1, we have one svg. in mode 2, we have two svgs.
var mode = 1;

// in distribution 1, we use gaussian. in distribution 2, we use random, in 3, correlated.
var whichDistribution = 3;

// which positions/shapes/svg are we modifying? 1 or 2
var which = 1;

// gaussian distribution
var mean = width/2, variance = 6000;

// correlation for linear trend task
var correlation = 0.6; // easy, medium, hard?


// radius of bounding circle in pixels
//  bcr = 12 assumes a visual angle of ~0.5 degrees for each symbol (????)
var bcr = 10;

// the rotation of svg 1 and 2
var svgRotation = 0;
var svgRotation2 = 0;

// flag for printing helpful circles and stuff
var pretty = false;

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
  if(currSymbol == 1)
    symbol1 = s;
  else if(currSymbol == 2)
    symbol2 = s;
}

// set of shape positions
var shapes, shapes2;
shapes = svg.selectAll(".shape");

shapes2 = svg2.selectAll(".shape");

// remove all shapes in the svg areas and resample both
function reset() {
  let sv = (which == 1) ? svg : svg2;

  sv.selectAll("*").remove();
  resample();
}

// resample the distribution of shape positions
function resample() {
  let s = (which == 1) ? shapes : shapes2;
  let sv = (which == 1) ? svg : svg2;
  let rotate = (which == 1) ? svgRotation : svgRotation2;
  let ns = (which == 1) ? numShapes : numShapes2;

  let positions;

  if(whichDistribution == 1) {
    positions = getGaussianDistribution();
  } else if(whichDistribution == 2) {
    positions = getRandomDistribution();
  } else if(whichDistribution == 3) {
    positions = getCorrelatedDistribution();
  }

  s = sv.selectAll(".shape")
          .data([...Array(ns).keys()])
          .enter().append("g")
            .classed("shapecontainer", true)
            .attr('transform', function(d, i) {
              return 'translate(' +  positions[i][0] + ',' +
              positions[i][1] + ') rotate(' + (-rotate)  + ' 0 0)';
            });

  // make sure original shape variables are exposed
  if(which == 1)
    shapes = s;
  if(which == 2)
    shapes2 = s;
}

// get a gaussian distribution of x and y positions
function getGaussianDistribution() {
  var num = (which == 1) ? numShapes : numShapes2;
  var positions = [];
  var x, y;

  distribution = gaussian(mean, variance);

  for(var i = 0; i < num; i++) {
    x = distribution.ppf(Math.random());
    y = distribution.ppf(Math.random());
    positions.push([x,y]);
  }
  return positions;
}

function getCorrelatedDistribution() {
  var num = (which == 1) ? numShapes : numShapes2;
  var positions = [];
  var x, y;

  distribution = gaussian(mean, variance);
  // get a gaussian distribution of x and y positions
  positions = getGaussianDistribution();

  // // transform each y to y'
  var l = lambda(correlation);
  for(i = 0; i < num; i++) {
    x = positions[i][0];
    y = positions[i][1];
    positions[i][1] = (((l*x) + ((1-l)*y))/(Math.sqrt((l*l) + ((1-l)*(1-l)))));
  }

  // if any point is > 2.5 stddev from mean, remove it and generate a new point



  // adjust points?

  // rescale?

  // recenter
  var thisCenter = averagePosition(positions);
  var deltas = [
    thisCenter[0] - center[0],
    thisCenter[1] - center[1]
  ];

  for(i = 0; i < num; i++) {
    positions[i][0] -= deltas[0];
    positions[i][1] -= deltas[1];
  }

  return positions;
}
// lambda function used in the transformation of y' positions.
// r is the desired correlation.
function lambda(r) {
  return (((r*r)-Math.sqrt((r*r)-(r*r*r*r)))/((2*r*r)-1));
}



function getRandomDistribution() {
  var num = (which == 1) ? numShapes : numShapes2;
  var positions = [];
  var x, y;

  for(var i = 0; i < num; i++) {
    x = ((Math.random() * ((width-2*bcr)-2*bcr)) + 2*bcr).toFixed(3);
    y = ((Math.random() * ((height-2*bcr)-2*bcr)) + 2*bcr).toFixed(3);

    positions.push([x,y]);
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
    case "d":
      drawSymbols(symbol1, symbol2);
      break;
    case "r":
      reset();
      break;
    case "c":
      computeOverlaps(getPositions());
      break;
    case "v":
      toggleLayout();
      break;
    case "b":
      toggleWhich();
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


/*
 *
 *    Helper Functions
 *
 */

// compute radians from degrees
function degToRad(deg) {
  return deg*0.01745329252;
}

// computes and returns an array of [x,y] positions for all shapes
function getPositions() {
  let s = (which == 1) ? shapes : shapes2;

  var positions = [];
  s.each(function(d) {
    translate = d3.select(this).attr("transform");
    pos = translate.substring(translate.indexOf("(")+1, translate.indexOf(")")).split(",");
    pos[0] = +pos[0];
    pos[1] = +pos[1];
    positions.push(pos);
  });
  return positions;
}

// send all the current positions to the server to save
function sendPositions() {
  var data = {};
  var tmp = which;

  // associate the points with an id or set of conditions
  //data.id = condition+...+structure(etc)

  which = 1;
  data.pos1 = getPositions();
  which = 2;
  data.pos2 = getPositions();
  which = tmp;

  POST(data, function(r) {
    console.log(r.status);
  });
}

// compute the average position of an array of [x,y] points
function averagePosition(positions) {
  avgPos = [0,0];
  for(var i = 0; i < positions.length; i++) {
    avgPos[0]+=positions[i][0];
    avgPos[1]+=positions[i][1];
  }
  return([avgPos[0]/positions.length,avgPos[1]/positions.length]);
}

// compute the average of an array of numbers
function average(nums) {
  var avg = 0;
  for(var i = 0; i < nums.length; i++) {
    avg += nums[i];
  }
  return avg/nums.length;
}

// compute the stddev of an array of numbers
function stddev(nums) {
  var mean = average(nums);
  var sumSquareDiff = 0;
  for(var i = 0; i < nums.length; i++) {
    sumSquareDiff += (nums[i] - mean)*(nums[i] - mean);
  }
  return Math.sqrt(sumSquareDiff/nums.length);
}

// rotate the svg by increments of 90 degrees. (note that shapes should stay the same way up)
function rotateSVG() {
  let sv = (which == 1) ? svg : svg2;
  let rotate = (which == 1) ? svgRotation : svgRotation2;

  sv.attr('transform', 'rotate(' + (rotate+=90)  + ' 0 0)');
  sv.selectAll(".shapecontainer")
    .attr("transform", function(d,i) {
      var myXform = d3.select(this).attr("transform");
      return myXform.slice(0, myXform.indexOf("rotate")) + ' rotate(' + (-rotate)  + ' 0 0)';
    });

  // make sure original rotation variables are exposed
  if(which == 1)
    svgRotation = rotate;
  if(which == 2)
    svgRotation2 = rotate;
}

// brute force n^2 approach
function computeOverlaps(positions) {
  var counts = [];
  var px = 0, py = 0;

  // for each position, find number in (bounding circle radius bcr) around point
  for(var i = 0; i < positions.length; i++) {
    px = positions[i][0];
    py = positions[i][1];
    counts.push( searchAll(positions, px, py, bcr).length );
  }

  console.log(average(counts), stddev(counts));
}

// Find the symbols within the specified circle (brute force)
function searchAll(p, cx, cy, radius) {
  if(pretty) {
    thiscirc = svg.append('g');
    thiscirc.append('circle')
      .attrs({ cx: cx, cy: cy, r:radius , fill: 'none', stroke:'blue' });
  }

  var contains = [];

  for(var i = 0; i < p.length; i++) {
    var d = p[i]; // d is current considered point
    if(d[0] == cx && d[1] == cy) continue; // self

    if(pretty) {
      thiscirc = svg.append('g');
      thiscirc.append('circle').attrs({ cx: d[0], cy: d[1], r:radius , fill: 'none'});
      thiscirc.attr('stroke','purple');
    }

    if(inCircle(d[0], d[1], cx, cy, radius)) {
      if(pretty) thiscirc.attr('stroke','green');

      contains.push(d);
    } else if(pretty) {
      thiscirc.attrs({stroke:'red','stroke-dasharray':'3'});
    }
  }

  return contains;
}

/*
 *  return true if the given coordinates are within (radius) distance
 *    of the point defined by cx, cy
 */
function inCircle(x, y, cx, cy, radius) {
  return ((x) - cx) * ((x) - cx) + ((y) - cy) * ((y)- cy) < 4*radius * radius;
}
