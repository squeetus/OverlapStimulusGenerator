
function redrawSymbols() {
  if(mode == 1) {
    drawNumerosityTogether(getPositions(), symbol1, numShapes, symbol2, numShapes2);
  } else if(mode == 2) {
    drawNumerositySeparately(getPositions(1), symbol1, numShapes, getPositions(2), symbol2, numShapes2);
  }
}


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
    // .attr("class", function(d, i) {
    //   if(mode == 1) {
    //     return i % 2 === 0 ? getName(symbol) : getName(symbol2);
    //   }
    //   else return getName(symbol);
    // })
    .classed("shape", true)
    .attr("id", function(d, i) { return i; })
    .attr("d", function(d, i) {
        return symbol();
    })
    .style("stroke", "black")
    .style("fill", "none")
    .style("fill-opacity", 1)
    .style("opacity", 1);

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
      // .attr("class", function(d, i) {
      //   if(mode == 1) {
      //     return i % 2 === 0 ? getName(symbol) : getName(symbol2);
      //   }
      //   else return getName(symbol);
      // })
      .classed("shape", true)
      .attr("id", function(d, i) { return i; })
      .attr("d", function(d, i) {
          return symbol2();
      })
      .style("stroke", "black")
      .style("fill", "none")
      .style("fill-opacity", 1)
      .style("opacity", 1);

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
         // console.log('too close m8');
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
