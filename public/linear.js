// gaussian distribution
var mean = width/2, variance = 6000;

numShapes = numShapes2 = 50;

function redrawSymbols() {
  if(mode == 1) {
    // drawNumerosityTogether(getPositions(), symbol1, numShapes, symbol2, numShapes2);
  } else if(mode == 2) {
    // drawNumerositySeparately(getPositions(1), symbol1, numShapes, getPositions(2), symbol2, numShapes2);
  }
}

function drawLinearTogether(correlatedPositions, symbol, gaussianPositions, symbol2) {

  let sv = svg;
  let rotate = svgRotation;

  // produce a master positions list
  // assume a and b are the same number
  function splicePositions(a, b) {
    var c = [];
    // loop through each
    for(var i = 0; i < numShapes; i++) {
      c.push(a[i]);
      c.push(b[i]);
    }
    return c;
  }

  var positions = splicePositions(correlatedPositions, gaussianPositions);
  positions = coerceOverlaps(positions);

  // draw linear
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

  sv.selectAll(".shapecontainer")
    .attr("transform", function(d,i) {
      var myXform = d3.select(this).attr("transform");
      return myXform.slice(0, myXform.indexOf("rotate")) + ' rotate(' + (-rotate)  + ' 0 0)';
    });
}

function drawLinear(correlatedPositions, gaussianPositions, symbol1, symbol2) {
  let sv = (which == 1) ? svg : svg2;
  let rotate = (which == 1) ? svgRotation : svgRotation2;



  // draw linear
  s = sv.selectAll(".shape1")
          .data([...Array(correlatedPositions.length).keys()])
          .enter().append("g")
            .classed("shapecontainer", true)
            .attr('transform', function(d, i) {
              return 'translate(' +  correlatedPositions[i][0] + ',' +
              correlatedPositions[i][1] + ') rotate(' + (-rotate)  + ' 0 0)';
            });
  s.append("path")
    .classed("shape1", true)
    .attr("id", function(d, i) { return i; })
    .attr("d", symbol1())
    .style("stroke", "black")
    .style("fill", "none")
    .style("fill-opacity", 1)
    .style("opacity", 1);

  sv.selectAll(".shapecontainer")
    .attr("transform", function(d,i) {
      var myXform = d3.select(this).attr("transform");
      return myXform.slice(0, myXform.indexOf("rotate")) + ' rotate(' + (-rotate)  + ' 0 0)';
    });

  // draw gaussian
  if(mode == 2) {
    sv = svg2;
    sv.selectAll(".shapecontainer").remove();
  }
  s = sv.selectAll(".shape2")
          .data([...Array(gaussianPositions.length).keys()])
          .enter().append("g")
            .classed("shapecontainer", true)
            .attr('transform', function(d, i) {
              return 'translate(' +  gaussianPositions[i][0] + ',' +
              gaussianPositions[i][1] + ') rotate(' + (-rotate)  + ' 0 0)';
            });
  s.append("path")
    .classed("shape2", true)
    .attr("id", function(d, i) { return i; })
    .attr("d", symbol2())
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


function drawLinearSeparately(correlatedPositions, symbol, gaussianPositions, symbol2) {

    let rotate = svgRotation;

    correlatedPositions = coerceOverlapsWithCorrelation(correlatedPositions);
    gaussianPositions = coerceOverlaps(gaussianPositions);

    // draw linear
    svg.selectAll(".shapecontainer").remove();
    s = svg.selectAll(".shape1")
            .data([...Array(correlatedPositions.length).keys()])
            .enter().append("g")
              .classed("shapecontainer", true)
              .attr('transform', function(d, i) {
                return 'translate(' +  correlatedPositions[i][0] + ',' +
                correlatedPositions[i][1] + ') rotate(' + (-rotate)  + ' 0 0)';
              });
    s.append("path")
      .classed("shape1", true)
      .attr("id", function(d, i) { return i; })
      .attr("d", symbol1)
      .style("stroke", "black")
      .style("fill", "none")
      .style("fill-opacity", 1)
      .style("opacity", 1);

    svg.selectAll(".shapecontainer")
      .attr("transform", function(d,i) {
        var myXform = d3.select(this).attr("transform");
        return myXform.slice(0, myXform.indexOf("rotate")) + ' rotate(' + (-rotate)  + ' 0 0)';
      });



    rotate = svgRotation2;

    svg2.selectAll(".shapecontainer").remove();
    s = svg2.selectAll(".shape")
            .data([...Array(gaussianPositions.length).keys()])
            .enter().append("g")
              .classed("shapecontainer", true)
              .attr('transform', function(d, i) {
                return 'translate(' +  gaussianPositions[i][0] + ',' +
                gaussianPositions[i][1] + ') rotate(' + (-rotate)  + ' 0 0)';
              });
    s.append("path")
      .classed("shape1", true)
      .attr("id", function(d, i) { return i; })
      .attr("d", symbol2)
      .style("stroke", "black")
      .style("fill", "none")
      .style("fill-opacity", 1)
      .style("opacity", 1);

    svg2.selectAll(".shapecontainer")
      .attr("transform", function(d,i) {
        var myXform = d3.select(this).attr("transform");
        return myXform.slice(0, myXform.indexOf("rotate")) + ' rotate(' + (-rotate)  + ' 0 0)';
      });

  }



function getGaussianDistribution(num) {
  // var num = (which == 1) ? numShapes : numShapes2;
  var positions = [];
  var x, y;

  distribution = gaussian(mean, variance);

  for(var i = 0; i < num; i++) {
    do{
      x = distribution.ppf(Math.random());
      y = distribution.ppf(Math.random());
    } while(!validOverlapPoint([x, y], positions));

    positions.push([x,y]);
  }
  return positions;
}

// take the current set of positions and coerce them to a specific overlap percentage
function coerceOverlaps(positions) {
  var x, y;
  var point;

  var maxTries = 50; // tries before giving up
  var tries = 0;  // current tries
  var numToResample = 0; // guess at number of shapes to resample
  var overlapPercentage = computeOverlapPercentage(positions);


  // keep trying until tries are exhausted or we're close enough
  while((++tries < maxTries) &&
      Math.abs(overlapPercentage - desiredOverlapPercentage) > 0.025) {

    // guess half the difference between overlaps, or 1
    numToResample = Math.max(Math.abs(overlapPercentage - desiredOverlapPercentage) * 50, 1);

    console.log('try: ', tries, overlapPercentage, desiredOverlapPercentage, numToResample);

    // too many overlaps
    if(overlapPercentage - desiredOverlapPercentage > 0) {
      console.log('get rid of some overlaps');
      // resample some overlapping shapes (from gaussian distribution)
      // find overlapping shapes
      for(var i = 0; i < numToResample; i++) {
        var idx = findOverlapping(positions); // get index of an overlap
        // console.log('found', positions[idx], 'at index', idx);
        // if valid index...
        if(idx > 0 && idx < positions.length) {
          // find a new valid non-overlapping point
          do {

            point = sampleGaussian();
            // console.log('resampling...', validOverlapPoint(point, positions), countOverlapsForPoint(point, positions));
          } while(!validOverlapPoint(point, positions) || countOverlapsForPoint(point, positions) > 0 );

          // replace the point!
          // console.log('replacing', positions[idx], 'with', point, 'at index', idx);
          positions[idx] = point;
        }
      }
    } else { // not enough overlaps
      console.log('add some overlaps');
      // resample a non-overlapping shape (from gaussian distribution)
      // find non-overlapping shapes
      for(var i = 0; i < numToResample; i++) {
        var idx = findNonOverlapping(positions); // get index of a non-overlap
        // console.log('found', positions[idx], 'at index', idx);
        // if valid index...
        if(idx > 0 && idx < positions.length) {
          // find a new valid non-overlapping point
          do {
            point = sampleGaussian();
            // console.log('resampling...', validOverlapPoint(point, positions), countOverlapsForPoint(point, positions));
          } while(!validOverlapPoint(point, positions) || countOverlapsForPoint(point, positions) === 0 );

          // replace the point!
          // console.log('replacing', positions[idx], 'with', point, 'at index', idx);
          positions[idx] = point;
        }
      }

    }

    // update overlapPercentage
    overlapPercentage = computeOverlapPercentage(positions);
  }

  return positions;
}

function coerceOverlapsWithCorrelation(positions) {
  var x, y;
  var point;

  var maxTries = 50; // tries before giving up
  var tries = 0;  // current tries
  var numToResample = 0; // guess at number of shapes to resample
  var overlapPercentage = computeOverlapPercentage(positions);
  var r = correlation(positions);

  // console.log('!!',(++tries < maxTries),
  //     Math.abs(overlapPercentage - desiredOverlapPercentage) > 0.025,
  //     Math.abs(r - targetCorrelation) > 0.025);
  //     console.log(r, targetCorrelation);

  // keep trying until tries are exhausted or we're close enough
  //   (both to overlap percentage and linear correlation)
  while((++tries < maxTries) &&
      (Math.abs(overlapPercentage - desiredOverlapPercentage) > 0.025 ||
      Math.abs(r - targetCorrelation) > 0.025)) {

    // guess half the difference between overlaps, or 1
    numToResample = Math.max(Math.abs(overlapPercentage - desiredOverlapPercentage) * 50, 1);

    console.log('(correlated) try: ', tries, overlapPercentage, desiredOverlapPercentage, numToResample, r, targetCorrelation);

    // too many overlaps
    if(overlapPercentage - desiredOverlapPercentage > 0) {
      console.log('get rid of some overlaps');
      // resample some overlapping shapes (from gaussian distribution)
      // find overlapping shapes
      for(var i = 0; i < numToResample; i++) {
        var idx = findOverlapping(positions); // get index of an overlap
        // console.log('found', positions[idx], 'at index', idx);
        // if valid index...
        if(idx > 0 && idx < positions.length) {
          // find a new valid non-overlapping point
          do {

            point = sampleGaussian();

            // try using the lambda function here?
            // TODO

            // console.log('resampling...', validOverlapPoint(point, positions), countOverlapsForPoint(point, positions));
          } while(!validOverlapPoint(point, positions) || countOverlapsForPoint(point, positions) > 0 );

          // replace the point!
          // console.log('replacing', positions[idx], 'with', point, 'at index', idx);
          positions[idx] = point;
        }
      }
    } else { // not enough overlaps
      console.log('add some overlaps');
      // resample a non-overlapping shape (from gaussian distribution)
      // find non-overlapping shapes
      for(var i = 0; i < numToResample; i++) {
        var idx = findNonOverlapping(positions); // get index of a non-overlap
        // console.log('found', positions[idx], 'at index', idx);
        // if valid index...
        if(idx > 0 && idx < positions.length) {
          // find a new valid non-overlapping point
          do {
            point = sampleGaussian();

            // try using the lambda function here?
            // TODO

            // console.log('resampling...', validOverlapPoint(point, positions), countOverlapsForPoint(point, positions));
          } while(!validOverlapPoint(point, positions) || countOverlapsForPoint(point, positions) === 0 );

          // replace the point!
          // console.log('replacing', positions[idx], 'with', point, 'at index', idx);
          positions[idx] = point;
        }
      }

    }

    // update overlapPercentage
    overlapPercentage = computeOverlapPercentage(positions);
    r = correlation(positions);
  }

  return positions;
}

function sampleGaussian() {
  x = distribution.ppf(Math.random());
  y = distribution.ppf(Math.random());
  return [x,y];
}

// find a point (in an odd index) which has overlaps
function findOverlapping(positions) {
  for(var i = 1; i < positions.length; i+=2) {
    if(countOverlapsForPointAtIndex(i, positions) > 0) {
      // console.log('eureka, found an index with overlaps!', i);
      return i;
    }
  }
  return -1;
}

// find a point (in an odd index) which has no overlaps
function findNonOverlapping(positions) {
  for(var i = 1; i < positions.length; i+=2) {
    if(countOverlapsForPointAtIndex(i, positions) === 0) {
      // console.log('eureka, found an index with no overlaps!', i);
      return i;
    }
  }
  return -1;
}

function getCorrelatedDistribution(num) {
  // var num = (which == 1) ? numShapes : numShapes2;
  var positions, x, y;

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
