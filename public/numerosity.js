var task = 'numerosity';

// number of shapes in categories 1 and 2
var numShapes = 37;
var numShapes2 = 63;

// for separate plot displays, swap the distributions
function swapSides() {
  var tmp;

  // swap symbols
  tmp = symbol2;
  symbol2 = symbol1;
  symbol1 = tmp;

  // swap number
  tmp = numShapes2;
  numShapes2 = numShapes;
  numShapes = tmp;

  drawNumerositySeparately(getPositions(2), symbol1, numShapes, getPositions(1), symbol2, numShapes2);
}

// redraw when symbols change
function redrawSymbols() {
  if(mode == 1) {
    drawNumerosityTogether(getPositions(), symbol1, numShapes, symbol2, numShapes2);
  } else if(mode == 2) {
    drawNumerositySeparately(getPositions(1), symbol1, numShapes, getPositions(2), symbol2, numShapes2);
  }
}

// draw single-plot displays
function drawNumerosityTogether(positions, symbol, count, symbol2, count2) {
  let sv = svg;
  let rotate = svgRotation;

  // keep track of how many of each type have been drawn
  let drawn = 0, drawn2 = 0;

  // draw shapes
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

  // rotate shapes accordingly
  sv.selectAll(".shapecontainer")
    .attr("transform", function(d,i) {
      var myXform = d3.select(this).attr("transform");
      return myXform.slice(0, myXform.indexOf("rotate")) + ' rotate(' + (-rotate)  + ' 0 0)';
    });
}

// draw separate-plot displays
function drawNumerositySeparately(positions, symbol, count, positions2, symbol2, count2) {
  // keep track of how many of each type have been drawn
  let drawn = 0, drawn2 = 0;

  // left
  svg.selectAll(".shapecontainer").remove();
  s = svg.selectAll(".shape")
          .data([...Array(positions.length).keys()])
          .enter().append("g")
            .classed("shapecontainer", true)
            .attr('transform', function(d, i) {
              return 'translate(' +  positions[i][0] + ',' +
              positions[i][1] + ') rotate(' + (-svgRotation)  + ' 0 0)';
            });
  s.append("path")
    .classed("shape", true)
    .attr("id", function(d, i) { return i; })
    .attr("d", function(d, i) {
        return symbol();
    })
    .style("stroke", "black")
    .style("fill", "none")
    .style("fill-opacity", 1)
    .style("opacity", 1);

  // rotate shapes accordingly
  svg.selectAll(".shapecontainer")
    .attr("transform", function(d,i) {
      var myXform = d3.select(this).attr("transform");
      return myXform.slice(0, myXform.indexOf("rotate")) + ' rotate(' + (-svgRotation)  + ' 0 0)';
    });

  // right
  svg2.selectAll(".shapecontainer").remove();
  s = svg2.selectAll(".shape")
          .data([...Array(positions2.length).keys()])
          .enter().append("g")
            .classed("shapecontainer", true)
            .attr('transform', function(d, i) {
              return 'translate(' +  positions2[i][0] + ',' +
              positions2[i][1] + ') rotate(' + (-svgRotation2)  + ' 0 0)';
            });
  s.append("path")
    .classed("shape", true)
    .attr("id", function(d, i) { return i; })
    .attr("d", function(d, i) {
        return symbol2();
    })
    .style("stroke", "black")
    .style("fill", "none")
    .style("fill-opacity", 1)
    .style("opacity", 1);

  // rotate shapes accordingly
  svg2.selectAll(".shapecontainer")
    .attr("transform", function(d,i) {
      var myXform = d3.select(this).attr("transform");
      return myXform.slice(0, myXform.indexOf("rotate")) + ' rotate(' + (-svgRotation2)  + ' 0 0)';
    });
}

/*
  Produce a set of positions with a specific amount of overlap:
  easy - 30%
  medium - 50%
  hard - 70%
*/
function getOverlapDistribution(num, desiredOverlap) {
  var positions = [];
  var x, y;
  if(!desiredOverlap) desiredOverlap = 0.2;

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
    return positions[Math.floor(Math.random()*positions.length)];
  }

  // determine a new anchor position
  function placeAnchor() {

    x = randomFromInterval(xRange[0], xRange[1], 3);
    y = randomFromInterval(yRange[0], yRange[1], 3);

    // make sure to get a valid anchor position
    while(!validAnchor([x, y])) {
      x = randomFromInterval(xRange[0], xRange[1], 3);
      y = randomFromInterval(yRange[0], yRange[1], 3);
    }

    return [x,y];
  }

  // create a new valid point overlapping an existing one
  function placeOverlapper() {
      do {
        // pick an existing position to draw next to
        anchor = pickAnchor();

        // pick an angle around the chosen anchor
        theta = randomFromInterval(0, 2*Math.PI);

        // pick a distance from the anchor (not too close or far)
        d = randomFromInterval(0.2*bcr*2, 0.8*bcr*2);

        // determine new coordinates from angle and distance
        dx = d * Math.cos(theta);
        dy = d * Math.sin(theta);

        x = anchor[0] + dx;
        y = anchor[1] + dy;

      } while(!validOverlapPoint([x, y], positions));

      return [x,y];
  }

  // does the point p([x, y]) overlap any other positions?
  function hasOverlap(p) {
    for(var i = 0; i < positions.length; i++) {
      if((Math.abs(p[0] - positions[i][0]) < 2*bcr) &&
       (Math.abs(p[1] - positions[i][1]) < 2*bcr)){
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
         return false;
       }

      // otherwise, count the number of overlaps
      if((Math.abs(p[0] - positions[i][0]) < 2*bcr) &&
       (Math.abs(p[1] - positions[i][1]) < 2*bcr)){

        overlaps++;
      }
    }

    return (overlaps < overlapThreshold);
  }

  // place a single anchor position to start
  // for(var i = 0; i < anchorPositions; i++) {
    positions.push(placeAnchor());
  // }

  // add [num - anchorPositions] locations overlapping at least one current location.
  // for(var j = 0; j < (num-anchorPositions); j++) {
  for(var j = 0; j < (num-1); j++) {

    // randomly place next position with or without overlap
    if(Math.random() < desiredOverlap) {
      //  overlap:
      positions.push(placeOverlapper());
    } else {
      // no overlap
      positions.push(placeAnchor()); // anchor positions can not overlap
    }
  }

  return positions;
}
