
function tmp() {
  var tmp = d3.path();
  tmp.moveTo(0,0);
  tmp.lineTo(0, -bcr);
  tmp.moveTo(0,0);
  tmp.lineTo(-bcr, 0);
  return tmp.toString();
}

function dot() {
  var path =
    "m " + -0.5 + ", 0" +
    "a " + 0.5 + "," + 0.5 + " 0 1, 0 " + (0.5*2) + ", 0" +
    "a " + 0.5 + "," + 0.5 + " 0 1, 0 " + -(0.5*2) + ", 0";
  return path;
}

function circle() {
  var path =
    "m " + -bcr + ", 0" +
    "a " + bcr + "," + bcr + " 0 1, 0 " + (bcr*2) + ", 0" +
    "a " + bcr + "," + bcr + " 0 1, 0 " + -(bcr*2) + ", 0";
  return path;
}

function pentagon() {
  var p = d3.path();
  p.moveTo(bcr * Math.cos(degToRad(-18)), bcr * Math.sin(degToRad(-18)));
  p.lineTo(0, -bcr);
  p.lineTo(bcr * Math.cos(degToRad(-162)), bcr * Math.sin(degToRad(-162)));
  p.lineTo(bcr * Math.cos(degToRad(-234)), bcr * Math.sin(degToRad(-234)));
  p.lineTo(bcr * Math.cos(degToRad(-306)), bcr * Math.sin(degToRad(-306)));
  p.lineTo(bcr * Math.cos(degToRad(-18)), bcr * Math.sin(degToRad(-18)));
  return p.toString();
}

function square() {
  var s = d3.path();
  s.moveTo(bcr * Math.cos(degToRad(45)), bcr * Math.sin(degToRad(45)));
  s.lineTo(bcr * Math.cos(degToRad(135)), bcr * Math.sin(degToRad(135)));
  s.lineTo(bcr * Math.cos(degToRad(-135)), bcr * Math.sin(degToRad(-135)));
  s.lineTo(bcr * Math.cos(degToRad(-45)), bcr * Math.sin(degToRad(-45)));
  s.lineTo(bcr * Math.cos(degToRad(45)), bcr * Math.sin(degToRad(45)));
  return s.toString();
}

function triangle() {
  var t = d3.path();
  t.moveTo(0,-bcr);
  t.lineTo(bcr * Math.cos(degToRad(30)), bcr * Math.sin(degToRad(30)));
  t.lineTo(bcr * Math.cos(degToRad(150)), bcr * Math.sin(degToRad(150)));
  t.lineTo(0,-bcr);
  return t.toString();
}

function sixLine() {
  var path = d3.path();
    path.moveTo(0, -bcr);
    path.lineTo(0, bcr);
    path.moveTo(0, 0);
    path.lineTo(bcr * Math.cos(degToRad(-30)), bcr * Math.sin(degToRad(-30)));
    path.moveTo(0, 0);
    path.lineTo(bcr * Math.cos(degToRad(30)), bcr * Math.sin(degToRad(30)));
    path.moveTo(0, 0);
    path.lineTo(bcr * Math.cos(degToRad(150)), bcr * Math.sin(degToRad(150)));
    path.moveTo(0, 0);
    path.lineTo(bcr * Math.cos(degToRad(-150)), bcr * Math.sin(degToRad(-150)));
    path.closePath();
  return path;
}

function fiveLine() {
  var path = d3.path();
    path.moveTo(0, 0);
    path.lineTo(0, -bcr);
    path.moveTo(0, 0);
    path.lineTo(bcr * Math.cos(degToRad(-18)), bcr * Math.sin(degToRad(-18)));
    path.moveTo(0, 0);
    path.lineTo(bcr * Math.cos(degToRad(54)), bcr * Math.sin(degToRad(54)));
    path.moveTo(0, 0);
    path.lineTo(bcr * Math.cos(degToRad(-234)), bcr * Math.sin(degToRad(-234)));
    path.moveTo(0, 0);
    path.lineTo(bcr * Math.cos(degToRad(-162)), bcr * Math.sin(degToRad(-162)));
  return path;
}

function fourLine() {
  var path = d3.path();
    path.moveTo(0, 0);
    path.lineTo(bcr, 0);
    path.moveTo(0, 0);
    path.lineTo(-bcr, 0);
    path.moveTo(0, 0);
    path.lineTo(0, -bcr);
    path.moveTo(0, 0);
    path.lineTo(0, bcr);
    path.closePath();
  return path;
}

function threeLine() {
  var path = d3.path();
    path.moveTo(0, 0);
    path.lineTo(0, -bcr);
    path.moveTo(0, 0);
    path.lineTo(bcr * Math.cos(degToRad(30)), bcr * Math.sin(degToRad(30)));
    path.moveTo(0, 0);
    path.lineTo(bcr * Math.cos(degToRad(150)), bcr * Math.sin(degToRad(150)));
    path.closePath();
  return path;
}




// function dots() {
//   let s = (which == 1) ? shapes : shapes2;
//   let sv = (which == 1) ? svg : svg2;
//   let rotate = (which == 1) ? svgRotation : svgRotation2;
//
//   s.append("circle")
//       .classed("shape", true)
//       .attr("cx", 0)
//       .attr("cy", 0)
//       .attr("r", 1)
//       .style("stroke", "black")
//       .style("fill-opacity", 1)
//       .style("opacity", 1);
// }

// function circles() {
//   let s = (which == 1) ? shapes : shapes2;
//   let sv = (which == 1) ? svg : svg2;
//   let rotate = (which == 1) ? svgRotation : svgRotation2;
//
//   s.append("circle")
//       .classed("shape", true)
//       .attr("cx", 0)
//       .attr("cy", 0)
//       .attr("r", bcr)
//       .style("stroke", "black")
//       .style("fill", "none")
//       .style("fill-opacity", 1)
//       .style("opacity", 1);
// }
function getName(func) {
  var f = String(func);
  return f.slice(f.indexOf(" "), f.indexOf("(")).trim();
}

function drawSymbols(symbol, symbol2) {
  let s = (which == 1) ? shapes : shapes2;
  let sv = (which == 1) ? svg : svg2;
  let rotate = (which == 1) ? svgRotation : svgRotation2;

  s.selectAll(".shape").remove();
  s.append("path")
    .attr("class", function(d, i) {
      if(mode == 1) {
        return i % 2 === 0 ? getName(symbol) : getName(symbol2);
      }
      else return getName(symbol);
    })
    .classed("shape", true)
    .attr("id", function(d, i) { return i; })
    .attr("d", function(d, i) {
      if(mode == 1) {
        return i % 2 === 0 ? symbol() : symbol2();
      }
      else return symbol();
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

  sv.selectAll(".shapecontainer").remove();

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

function drawNumerosity(positions, symbol, count, symbol2, count2) {
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
