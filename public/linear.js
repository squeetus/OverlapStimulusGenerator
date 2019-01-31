var task = 'linear';

// properties of the distribution
var mean = width/2, variance = 6000;

// number of shapes should be equal for this task
numShapes = numShapes2 = 50;

// for separate plot displays, swap the distributions
function swapSides() {
  var tmp;

  // swap symbols
  tmp = symbol2;
  symbol2 = symbol1;
  symbol1 = tmp;

  justDrawLinearSeparately(getPositions(2), symbol1, getPositions(1), symbol2);
}

// redraw when symbols change
function redrawSymbols() {
  if(mode == 1) {
    justDrawLinearTogether(getPositions(), symbol1, symbol2);
  } else if(mode == 2) {
    justDrawLinearSeparately(getPositions(1), symbol1, getPositions(2), symbol2);
  }
}

// single-plot displays
function drawLinearTogether(correlatedPositions, symbol, gaussianPositions, symbol2) {

  // produce a master positions list
  // (assume a and b are the same number)
  function splicePositions(a, b) {
    var c = [];
    // loop through each
    for(var i = 0; i < numShapes; i++) {
      c.push(a[i]);
      c.push(b[i]);
    }
    return c;
  }

  // splice both distributions (unbiased rendering order)
  var positions = splicePositions(correlatedPositions, gaussianPositions);

  // coerce the overlaps in the display to desired percentage
  positions = coerceOverlaps(positions);

  // draw the display with the updated positions
  justDrawLinearTogether(positions, symbol, symbol2);
}

// actually draw the single-plot display
function justDrawLinearTogether(positions, symbol, symbol2) {
  let sv = svg;
  let rotate = svgRotation;

  // draw shapes
  sv.selectAll(".shapecontainer").remove();
  s = sv.selectAll(".shape1")
          .data([...Array(positions.length).keys()])
          .enter().append("g")
            .classed("shapecontainer", true)
            .attr('transform', function(d, i) {
              return 'translate(' +  positions[i][0] + ',' +
              positions[i][1] + ') rotate(' + (-rotate)  + ' 0 0)';
            });
  s.append("path")
    .classed("shape1", true)
    .attr("id", function(d, i) { return i; })
    .attr("d", function(d, i) {
      if(i % 2 === 0) {
        return symbol();
      } else {
        return symbol2();
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

// separate-plot displays
function drawLinearSeparately(correlatedPositions, symbol, gaussianPositions, symbol2) {

  // coerce both distributions to desired overlap threshold
  correlatedPositions = coerceOverlapsWithCorrelation(correlatedPositions);
  gaussianPositions = coerceOverlaps(gaussianPositions);

  // pick which side to draw the distributions to
  if(correctSide == 1) {
    justDrawLinearSeparately(correlatedPositions, symbol, gaussianPositions, symbol2);
  } else if(correctSide == 2) {
    justDrawLinearSeparately(gaussianPositions, symbol, correlatedPositions, symbol2);
  }
}

// actually draw the separate-plot displays
function justDrawLinearSeparately(positions, symbol, positions2, symbol2) {
  let rotate = svgRotation;

  // draw left
  svg.selectAll(".shapecontainer").remove();
  s = svg.selectAll(".shape1")
          .data([...Array(positions.length).keys()])
          .enter().append("g")
            .classed("shapecontainer", true)
            .attr('transform', function(d, i) {
              return 'translate(' +  positions[i][0] + ',' +
              positions[i][1] + ') rotate(' + (-rotate)  + ' 0 0)';
            });
  s.append("path")
    .classed("shape1", true)
    .attr("id", function(d, i) { return i; })
    .attr("d", symbol)
    .style("stroke", "black")
    .style("fill", "none")
    .style("fill-opacity", 1)
    .style("opacity", 1);

  // rotate shapes accordingly
  svg.selectAll(".shapecontainer")
    .attr("transform", function(d,i) {
      var myXform = d3.select(this).attr("transform");
      return myXform.slice(0, myXform.indexOf("rotate")) + ' rotate(' + (-rotate)  + ' 0 0)';
    });

  // draw right
  rotate = svgRotation2;
  svg2.selectAll(".shapecontainer").remove();
  s = svg2.selectAll(".shape")
          .data([...Array(positions2.length).keys()])
          .enter().append("g")
            .classed("shapecontainer", true)
            .attr('transform', function(d, i) {
              return 'translate(' +  positions2[i][0] + ',' +
              positions2[i][1] + ') rotate(' + (-rotate)  + ' 0 0)';
            });
  s.append("path")
    .classed("shape1", true)
    .attr("id", function(d, i) { return i; })
    .attr("d", symbol2)
    .style("stroke", "black")
    .style("fill", "none")
    .style("fill-opacity", 1)
    .style("opacity", 1);

  // rotate shapes accordingly
  svg2.selectAll(".shapecontainer")
    .attr("transform", function(d,i) {
      var myXform = d3.select(this).attr("transform");
      return myXform.slice(0, myXform.indexOf("rotate")) + ' rotate(' + (-rotate)  + ' 0 0)';
    });
}

// return a gaussian distribution of valid points (within bounds, not too many overlaps)
function getGaussianDistribution(num) {
  var positions = [];
  var x, y;

  distribution = gaussian(mean, variance);

  for(var i = 0; i < num; i++) {
    // sample until next point is valid
    do{
      x = distribution.ppf(Math.random());
      y = distribution.ppf(Math.random());
    } while(!validOverlapPoint([x, y], positions));

    positions.push([x,y]);
  }
  return positions;
}

// take the current set of positions and coerce them close to a specific overlap percentage
function coerceOverlaps(positions) {
  var x, y;
  var point;

  var maxTries = 50; // tries before giving up
  var tries = 0;  // current tries
  var numToResample = 0; // guess at number of shapes to resample
  var overlapPercentage = computeOverlapPercentage(positions);  // initial overlap

  // keep trying until tries are exhausted or we're close enough
  while((++tries < maxTries) &&
      Math.abs(overlapPercentage - desiredOverlapPercentage) > 0.025) {

    // guess half the difference between overlaps, or 1
    numToResample = Math.max(Math.abs(overlapPercentage - desiredOverlapPercentage) * 50, 1);

    // console.log('try: ', tries, overlapPercentage, desiredOverlapPercentage, numToResample);

    // if too many overlaps
    if(overlapPercentage - desiredOverlapPercentage > 0) {
      // console.log('get rid of some overlaps');

      // resample some overlapping shapes (from gaussian distribution)
      for(var i = 0; i < numToResample; i++) {
        var idx = findOverlapping(positions); // get index of an overlap
        // if valid index...
        if(idx > 0 && idx < positions.length) {
          // find a new valid non-overlapping point
          do {
            point = sampleGaussian();
          } while(!validOverlapPoint(point, positions) || countOverlapsForPoint(point, positions) > 0 );

          // replace the point
          positions[idx] = point;
        }
      }
    } else { // not enough overlaps
      // console.log('add some overlaps');

      // resample a non-overlapping shape (from gaussian distribution)
      for(var i = 0; i < numToResample; i++) {
        var idx = findNonOverlapping(positions); // get index of a non-overlap;
        // if valid index...
        if(idx > 0 && idx < positions.length) {
          // find a new valid overlapping point
          do {
            point = sampleGaussian();
          } while(!validOverlapPoint(point, positions) || countOverlapsForPoint(point, positions) === 0 );

          // replace the point!
          positions[idx] = point;
        }
      }
    }

    // update overlapPercentage before next try
    overlapPercentage = computeOverlapPercentage(positions);
  }

  return positions;
}

// take the current set of positions and coerce them close to a specific overlap percentage
// take correlation value into account
function coerceOverlapsWithCorrelation(positions) {
  var x, y;
  var point;

  var maxTries = 50; // tries before giving up
  var tries = 0;  // current tries
  var numToResample = 0; // guess at number of shapes to resample
  var overlapPercentage = computeOverlapPercentage(positions); // initial overlap
  var r = correlation(positions); // initial correlation

  // keep trying until tries are exhausted or we're close enough
  //   (both to overlap percentage and linear correlation)
  while((++tries < maxTries) &&
      (Math.abs(overlapPercentage - desiredOverlapPercentage) > 0.025 ||
      Math.abs(r - targetCorrelation) > 0.025)) {

    // guess half the difference between overlaps, or 1
    numToResample = Math.max(Math.abs(overlapPercentage - desiredOverlapPercentage) * 50, 1);

    // console.log('(correlated) try: ', tries, overlapPercentage, desiredOverlapPercentage, numToResample, r, targetCorrelation);

    // if too many overlaps
    if(overlapPercentage - desiredOverlapPercentage > 0) {
      // console.log('get rid of some overlaps');

      // resample some overlapping shapes (from gaussian distribution)
      for(var i = 0; i < numToResample; i++) {
        var idx = findOverlapping(positions); // get index of an overlap
        // if valid index...
        if(idx > 0 && idx < positions.length) {
          // find a new valid non-overlapping point
          do {
            point = sampleGaussian();
          } while(!validOverlapPoint(point, positions) || countOverlapsForPoint(point, positions) > 0 );

          // replace the point
          positions[idx] = point;
        }
      }
    } else { // not enough overlaps
      console.log('add some overlaps');

      // resample a non-overlapping shape (from gaussian distribution)
      for(var i = 0; i < numToResample; i++) {
        var idx = findNonOverlapping(positions); // get index of a non-overlap
        // if valid index...
        if(idx > 0 && idx < positions.length) {
          // find a new valid overlapping point
          do {
            point = sampleGaussian();
          } while(!validOverlapPoint(point, positions) || countOverlapsForPoint(point, positions) === 0 );

          // replace the point
          positions[idx] = point;
        }
      }
    }

    // update overlapPercentage before next try
    overlapPercentage = computeOverlapPercentage(positions);

    // update correlation before next try
    r = correlation(positions);
  }

  return positions;
}

// sample a new point from the distribution
function sampleGaussian() {
  x = distribution.ppf(Math.random());
  y = distribution.ppf(Math.random());
  return [x,y];
}

// find a point (in an odd index) which has overlaps
function findOverlapping(positions) {
  for(var i = 1; i < positions.length; i+=2) {
    if(countOverlapsForPointAtIndex(i, positions) > 0) {
      return i;
    }
  }
  return -1;
}

// find a point (in an odd index) which has no overlaps
function findNonOverlapping(positions) {
  for(var i = 1; i < positions.length; i+=2) {
    if(countOverlapsForPointAtIndex(i, positions) === 0) {
      return i;
    }
  }
  return -1;
}

// return a set of [num] points within .02 of the target correlation value
function getCorrelatedDistribution(num) {
  var positions, x, y;

  // try to get a guassian distribution close to desired correlation
  do {
    positions = [];
    distribution = gaussian(mean, variance);
    // get a gaussian distribution of x and y positions
    positions = getGaussianDistribution(num);

    // // transform each y to y'
    var l = lambda(targetCorrelation);
    for(i = 0; i < num; i++) {
      x = positions[i][0];
      y = positions[i][1];
      positions[i][1] = (((l*x) + ((1-l)*y))/(Math.sqrt((l*l) + ((1-l)*(1-l)))));
    }
  } while(Math.abs(correlation(positions) - targetCorrelation) > 0.02 );

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
