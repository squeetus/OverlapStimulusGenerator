
function tmp() {
  var tmp = d3.path();
  tmp.moveTo(0,0);
  tmp.lineTo(0, -bcr);
  tmp.moveTo(0,0);
  tmp.lineTo(-bcr, 0);
  return tmp.toString();
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

var sixLine = function() {
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
};

var fiveLine = function(size) {
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
};

var fourLine = function() {
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
};

var threeLine = function() {
  var path = d3.path();
    path.moveTo(0, 0);
    path.lineTo(0, -bcr);
    path.moveTo(0, 0);
    path.lineTo(bcr * Math.cos(degToRad(30)), bcr * Math.sin(degToRad(30)));
    path.moveTo(0, 0);
    path.lineTo(bcr * Math.cos(degToRad(150)), bcr * Math.sin(degToRad(150)));
    path.closePath();
  return path;
};




function dots() {
  let s = (which == 1) ? shapes : shapes2;
  let sv = (which == 1) ? svg : svg2;
  let rotate = (which == 1) ? svgRotation : svgRotation2;

  s.append("circle")
      .classed("shape", true)
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 1)
      .style("stroke", "black")
      .style("fill-opacity", 1)
      .style("opacity", 1);
}

function circles() {
  let s = (which == 1) ? shapes : shapes2;
  let sv = (which == 1) ? svg : svg2;
  let rotate = (which == 1) ? svgRotation : svgRotation2;

  s.append("circle")
      .classed("shape", true)
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", bcr)
      .style("stroke", "black")
      .style("fill", "none")
      .style("fill-opacity", 1)
      .style("opacity", 1);
}

function drawSymbols(symbol) {
  let s = (which == 1) ? shapes : shapes2;
  let sv = (which == 1) ? svg : svg2;
  let rotate = (which == 1) ? svgRotation : svgRotation2;
  
  s.selectAll(".shape").remove();
  s.append("path")
    .classed("shape", true)
    .attr("id", function(d, i) { return i; })
    .attr("d", symbol())
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
