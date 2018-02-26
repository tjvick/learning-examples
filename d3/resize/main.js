// Select the svg from the DOM
let chartBox = d3.select(".chartbox");
let svg = chartBox.select('svg');

// some data that doesn't change with redraw
let data = [1, 4, 6, 7, 7.5, 7.75]

// Define linear data scales
let xScale = d3.scaleLinear()
  .domain([0, data.length])

let yScale = d3.scaleLinear()
  .domain(d3.extent(data))

// Define mapping functions
let xMap = function(d, i) { return xScale(i) };
let yMap = function(d, i) { return yScale(d) };

function redraw() {
  // Get new dimensions of svg DOM element
  let width = chartBox.node().clientWidth;
  let height = chartBox.node().clientHeight;

  // if svg style is not already {width: 100%; height: 100%}
  // svg
  //   .attr("width", width)
  //   .attr("height", height)

  // Resize scales - this will affect xMap and yMap
  xScale.range([0, width])
  yScale.range([height, 0])

  // Select any existing circle elements and bind data
  let points = svg.selectAll("circle")
      .data(data)

  // Remove any circle elements without data
  points.exit().remove()

  // Add circle elements for detached data points
  points
    .enter()
    .append("circle")
      .style("fill", "blue")
  // merge added circle elements with existing circle elements
  // then, apply sizing to all of the elements
  // this actually updates sizes of all elements
    .merge(points)
      .attr("r", width*0.01)
      .attr("cx", xMap)
      .attr("cy", yMap)

}

// listen for resize event and redraw upon resize
window.addEventListener("resize", redraw);

// initial drawing
// points are added on this first drawing
redraw()
