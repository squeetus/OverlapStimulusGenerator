
// quadtree approach --
//  this doesn't seem able to take into account the size of the points,
//  so some overlaps were not being counted.
function computeOverlapsQuadtree(positions) {
  var quadtree = d3.quadtree()
      .extent([[-1, -1], [width + 1, height + 1]])
      .addAll(positions);

  drawQuadtreeRectangles(quadtree);

  var counts = [];
  var px = 0, py = 0;

  // for each position, find number in (bounding circle radius bcr) around point
  for(var i = 0; i < positions.length; i++) {
    px = positions[i][0];
    py = positions[i][1];
    counts.push( searchRadius(quadtree, px, py, bcr).length );
  }
}

// return true if the given coordinates from a quadtree are within (radius) distance
function rectCircleIntersect(rx, ry, rwidth, rheight, cx, cy, radius) {
  let dx = cx - Math.max(rx, Math.min(cx, rx + rwidth));
  let dy = cy - Math.max(ry, Math.min(cy, ry + rheight));
  return (dx * dx + dy * dy) < (radius * radius);
}


// Find the nodes within the specified circle in a quadtree
function searchRadius(quadtree, cx, cy, radius) {
  thiscirc = svg.append('g');
  thiscirc.append('circle')
    .attrs({ cx: cx, cy: cy, r:radius , fill: 'none', stroke:'blue' });

  var contains = [];
  quadtree.visit(function(node, x1, y1, x2, y2) {
    if (!node.length) {
      console.log(node);
      do {
        var d = node.data;
        if(d[0] == cx && d[1] == cy) continue;
        d.scanned = true;
        d.selected = inCircle(d[0], d[1], cx, cy, radius);

        thiscirc = svg.append('g');
        thiscirc.append('circle').attrs({ cx: d[0], cy: d[1], r:radius , fill: 'none'});
        thiscirc.attr('stroke','purple');
        if(d.selected) {
          contains.push(d);

          // console.log('overlap!');
          thiscirc.attr('stroke','green');
        } else {
          thiscirc.attrs({stroke:'red','stroke-dasharray':'3'});
        }
      } while (node = node.next);
    }

    return !rectCircleIntersect(x1, y1, x2 - x1, y2 - y1, cx, cy, radius);
  });
  return contains;
}

//
// // computes occupancy of uniform square regions of the display using a quadtree
// // NOT a good proxy for overlap, some shapes may share a cell without touching.
// function computeOccupancy(positions) {
//   var quadtree = d3.quadtree()
//       .extent([[-1, -1], [width + 1, height + 1]])
//       .addAll(positions);
//
//   var sq = bcr*2;
//   var binn = 0;
//   var bin = [];
//   for(var i = 0; i < width; i+=sq) {
//     bin[binn] = [];
//     for(var j = 0; j < height; j+=sq) {
//       bin[binn].push( search(quadtree,0+i, 0+j, i+sq, j+sq));
//     }
//     binn++;
//   }
//
//   //printBin(bin);
// }
//
// // prints occupancy bins row by row
// function printBin(bin) {
//   var row = "";
//   for(var i = 0; i < bin.length; i++) { // get each row
//     for(var col = 0; col < bin[0].length; col++) { // grab from each col for given row
//       row += bin[col][i].length + "  ";
//     }
//     console.log(row);
//     row = "";
//   }
// }
//
// // Find the nodes within the specified rectangle in a quadtree
// function search(quadtree, x0, y0, x3, y3) {
//   thisrect = svg.append('g');
//   thisrect.append('rect')
//     .attrs({ x: x0, y: y0, width: x3-x0, height: y3-y0, fill: 'none', stroke:'black' });
//
//   // console.log('searching', x0,y0,x3,y3);
//   var contains = [];
//   quadtree.visit(function(node, x1, y1, x2, y2) {
//     if (!node.length) {
//       do {
//         var d = node.data;
//         d.scanned = true;
//         d.selected = (d[0]+bcr >= x0) && (d[0]-bcr < x3) && (d[1]+bcr >= y0) && (d[1]-bcr < y3);
//         if(d.selected) contains.push(d);
//       } while (node = node.next);
//     }
//     return x1 >= x3 || y1 >= y3 || x2 < x0 || y2 < y0;
//   });
//
//   if(contains.length>0) thisrect.append("text").attrs({ x: x0, y: y0 + ((y3-y0)/2) }).text(contains.length);
//   return contains;
// }
function drawQuadtreeRectangles(qt) {
  svg.selectAll(".node")
    .data(nodes(qt))
    .enter().append("rect")
      .attr("class", "node")
      .attr("x", function(d) { return d.x0; })
      .attr("y", function(d) { return d.y0; })
      .attr("width", function(d) { return d.y1 - d.y0; })
      .attr("height", function(d) { return d.x1 - d.x0; });

  // Collapse the quadtree into an array of rectangles.
  function nodes(quadtree) {
    var nodes = [];
    quadtree.visit(function(node, x0, y0, x1, y1) {
      node.x0 = x0, node.y0 = y0;
      node.x1 = x1, node.y1 = y1;
      nodes.push(node);
      return (x1 - x0) < 5;
    });
    return nodes;
  }
}
