/*
 *
 *  Global Variables and keypress events
 *
 */

// attributes of the canvas area
var width = 500,
    height = 500,
    center = [width/2, height/2];

// for separate-display trials, which side should be correct?
var correctSide = 2;

// proportion of shapes in each display that should have overlaps
// Note: both overlap percentages will be equal for all trials
var desiredOverlapPercentage = 0.7;
var desiredOverlapPercentage2 = 0.7;

// master correlation target for all linear trend displays
// (we only want to vary overlap percentage for difficulty)
var targetCorrelation = 0.7;

var overlapThreshold = 4; // max number of overlaps for a new overlapping position

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

/*
 *  Keypress Events
 *
 */
document.addEventListener('keypress', (event) => {
  const keyName = event.key;

  switch(keyName) {
    case "1":
      modifySymbol(dot);
      break;
    case "2":
      modifySymbol(circle);
      break;
    case "3":
      modifySymbol(pentagon);
      break;
    case "4":
      modifySymbol(square);
      break;
    case "5":
      modifySymbol(triangle);
      break;
    case "6":
      modifySymbol(sixLine);
      break;
    case "7":
      modifySymbol(fiveLine);
      break;
    case "8":
      modifySymbol(fourLine);
      break;
    case "9":
      modifySymbol(threeLine);
      break;
    case "c":
      if(mode == 1) {
        computeOverlaps(getPositions());
        computeOverlapPercentage(getPositions());
      } else {
        console.log('left display:');
        computeOverlaps(getPositions(1));
        computeOverlapPercentage(getPositions(1));

        console.log('right display:');
        computeOverlaps(getPositions(2));
        computeOverlapPercentage(getPositions(2));
      }
      break;
    case "v":
      toggleLayout();
      break;
    case "b":
      toggleWhich();
      break;
    case "n":
      if(mode == 1) {
        do {
          console.log("Single-display numerosity...");
          drawNumerosityTogether(getOverlapDistribution(numShapes + numShapes2, desiredOverlapPercentage-0.2), symbol1, numShapes, symbol2, numShapes2);
        } while (Math.abs(computeOverlapPercentage(getPositions()) - desiredOverlapPercentage) > 0.025 );

        console.log(computeOverlapPercentage(getPositions(1)) + "%");

      } else {
        do {
          console.log("Double-display numerosity...");
          drawNumerositySeparately(getOverlapDistribution(numShapes, desiredOverlapPercentage-0.2), symbol1, numShapes, getOverlapDistribution(numShapes2, desiredOverlapPercentage2-0.2), symbol2, numShapes2);

        } while ((Math.abs(computeOverlapPercentage(getPositions(1)) - desiredOverlapPercentage) > 0.025) || (Math.abs(computeOverlapPercentage(getPositions(2)) - desiredOverlapPercentage2) > 0.025) );

        console.log('left overlaps:', computeOverlapPercentage(getPositions(1)) + "%");

        console.log('right overlaps:', computeOverlapPercentage(getPositions(2)) + "%");
      }
      break;
    case "m":
      if(mode == 1) {
        do {
          console.log("Single-display linear...");

          drawLinearTogether(getCorrelatedDistribution(numShapes), symbol1, getGaussianDistribution(numShapes2), symbol2);

          console.log(computeOverlapPercentage(getPositions(1))*100 + "%");

        } while (Math.abs(computeOverlapPercentage(getPositions(1)) - desiredOverlapPercentage) > 0.025);

        var sets = splitPositions(getPositions(1));
        console.log('shape1 r:', correlation(sets[0]));
        console.log('shape2 r:', correlation(sets[1]));

      } else {
        do {
          console.log("Double-display linear...");

          drawLinearSeparately(getCorrelatedDistribution(numShapes), symbol1, getGaussianDistribution(numShapes2), symbol2);

          console.log('left r:', correlation(getPositions(1)));
          console.log('right r:', correlation(getPositions(2)));

          console.log('left overlaps:', computeOverlapPercentage(getPositions(1)) + "%");
          console.log('right overlaps:', computeOverlapPercentage(getPositions(2)) + "%");

        } while (Math.abs(computeOverlapPercentage(getPositions(1)) - desiredOverlapPercentage) > 0.025 ||
        Math.abs(computeOverlapPercentage(getPositions(2)) - desiredOverlapPercentage2) > 0.025 ||
        Math.abs(correlation(getPositions(correctSide)) - targetCorrelation) > 0.025);

      }
      break;
    case "s":
      toggleShape();
      break;
    case "z":
      rotateSVG();
      break;
    case "p":
      sendStimulusData();
      break;
    case "w":
      swapSides();
  }

});
