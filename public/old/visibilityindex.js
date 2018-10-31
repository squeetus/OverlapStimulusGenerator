function visibilityIndex(x, h, p) {
  function y(x, h, p) {
    var a = 1.86056686,
        b = -3.25349985,
        c = 2.91520408,
        d = -0.68834377;

    return (a * Math.log(x)) + (b * Math.log(h)) + (c * Math.log(p)) + d;
  }

  return 1 / ( 1 + Math.pow(Math.E, y(x, h, p)));
}

var windowSize = 500; // square window
var datasetSize = 100;
var glyphSize = 15; // square glyph region

console.log(visibilityIndex(datasetSize, windowSize, glyphSize));
