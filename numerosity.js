/*
 *  Global Variables
 */

// attributes of the canvas area
var width = 550,
    height = 550,
    center = [width/2, height/2];

// in mode 1, we have one svg. in mode 2, we have two svgs.
var mode = 1;

// which positions/shapes/svg are we modifying? 1 or 2
var which = 1;

// attributes of the distribution
var mean = width/2, variance = 6000;
var distribution = gaussian(mean, variance);

// number of shapes in categories 1 and 2
var numShapes = 100;
var numShapes2 = 100;

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
              .style("border", "solid 2px black");


// swap between single and double window
function toggleLayout() {
  if(mode == 1) {
    svg2.attr("display", "inline");
    mode = 2;
  } else if(mode == 2) {
    svg2.attr("display", "none");
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

// set of shape positions
var shapes = svg.selectAll(".shape")
        .data([...Array(numShapes).keys()])
        .enter().append("g")
          .classed("shapecontainer", true)
          .attr('transform', function(d, i) {
            return 'translate(' +  distribution.ppf(Math.random()) + ',' +
            distribution.ppf(Math.random()) + ') rotate(' + (-svgRotation)  + ' 0 0)';
          });

var shapes2 = svg2.selectAll(".shape")
        .data([...Array(numShapes2).keys()])
        .enter().append("g")
          .classed("shapecontainer", true)
          .attr('transform', function(d, i) {
            return 'translate(' +  distribution.ppf(Math.random()) + ',' +
            distribution.ppf(Math.random()) + ') rotate(' + (-svgRotation2)  + ' 0 0)';
          });

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

  distribution.ppf(Math.random());
  s = sv.selectAll(".shape")
          .data([...Array(ns).keys()])
          .enter().append("g")
            .classed("shapecontainer", true)
            .attr('transform', function(d, i) {
              return 'translate(' +  distribution.ppf(Math.random()) + ',' +
              distribution.ppf(Math.random()) + ') rotate(' + (-rotate)  + ' 0 0)';
            });

  // make sure original shape variables are exposed
  if(which == 1)
    shapes = s;
  if(which == 2)
    shapes2 = s;
}

/*
 *  Listen for keypress events and modify the display accordingly
 */
document.addEventListener('keypress', (event) => {
  const keyName = event.key;

  switch(keyName) {
    case "1":
      dots();
      break;
    case "2":
      drawSymbols(circles);
      break;
    case "3":
      drawSymbols(pentagon);
      break;
    case "4":
      drawSymbols(square);
      break;
    case "5":
      drawSymbols(triangle);
      break;
    case "6":
      drawSymbols(sixLine);
      break;
    case "7":
      drawSymbols(fiveLine);
      break;
    case "8":
      drawSymbols(fourLine);
      break;
    case "9":
      drawSymbols(threeLine);
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
    case "z":
      rotateSVG();
      break;
  }

  // console.log('keypress event\n\n' + 'key: ' + keyName);
});

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

// compute the average position of an array of [x,y] points
function averagePosition(positions) {
  avgPos = [0,0];
  for(var i = 0; i < positions.length; i++) {
    avgPos[0]+=positions[i][0];
    avgPos[1]+=positions[i][1];
  }
  return(avgPos[0]/positions.length,avgPos[1]/positions.length);
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
  // var quadtree = d3.quadtree()
  //     .extent([[-1, -1], [width + 1, height + 1]])
  //     .addAll(positions);

  // drawQuadtreeRectangles(quadtree);

  var counts = [];
  var px = 0, py = 0;

  // for each position, find number in (bounding circle radius bcr) around point
  for(var i = 0; i < positions.length; i++) {
    px = positions[i][0];
    py = positions[i][1];
    // counts.push( searchRadius(quadtree, ));
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
