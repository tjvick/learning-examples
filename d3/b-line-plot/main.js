var initReturnRate = +document.getElementById('return-rate').value / 100;
var initWithdrawalRate = +document.getElementById('withdrawal-rate').value / 100;
var initYearsToLast = +document.getElementById('years-to-last').value;

// set chart size
var margin = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 40,
}
var width = 980 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add x-Axis
chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")

// add y-Axis
chart.append("g")
    .attr("class", "y axis")

var chartElements = chart.append("g")
    .attr("class", "chart-elements")

var foreverGroup = chartElements.append("g")
    .attr("class", "forever")

var finiteGroup = chartElements.append("g")
    .attr("class", "finite")

var hoverLines = chartElements.append("g")
    .attr("class", "hoverElements")

var returnRate = d3.select('#return-rate');
var withdrawalRate = d3.select('#withdrawal-rate');
var yearsToLast = d3.select('#years-to-last');

returnRate.on("change", function() {
    update(
      +this.value / 100,
      +withdrawalRate.property("value") / 100,
      +yearsToLast.property("value"),
    );
})

withdrawalRate.on("change", function() {
  update(
    +returnRate.property("value") / 100,
    +this.value / 100,
    +yearsToLast.property("value"),
  );
})

yearsToLast.on("change", function() {
  update(
    +returnRate.property("value") / 100,
    +withdrawalRate.property("value") / 100,
    +this.value,
  );
})

function calcData(rr, rw, yearsToLast) {
  var P0 = 0; // as a fraction of expenses

  function calcYearsInfinite(fs) {
    var alpha_s = fs / (1 - fs);
    var a = alpha_s / rr;
    var b = ( (1 / rw) + a) / (a + P0);
    var c = 1 + rr;
    var n = Math.log(b) / Math.log(c);
    if (isNaN(n)) {
      return null
    } else {
      return n
    }
  }

  function calcYearsFinite(fs) {
    var alpha_s = fs / (1-fs);
    var topLog = Math.log((1 + rr + alpha_s) / (alpha_s + rr*P0 + Math.pow( (1+rr), (1-yearsToLast) ) ) );
    var botLog = Math.log(1 + rr);
    var n = topLog / botLog;
    if (isNaN(n)) {
      return null
    } else {
      return n
    }
  }

  var savingsRates = []
  for (var i = 1; i<100; i++) {
    savingsRates.push(i*0.01);
  }

  var nYearsInfinite = savingsRates.map(calcYearsInfinite)

  var nYearsFinite = savingsRates.map(calcYearsFinite)
  console.log(nYearsFinite[0])

  return {
    savingsRates: savingsRates,
    nYearsInfinite: nYearsInfinite,
    nYearsFinite: nYearsFinite,
  }

}

// predefine some attributes of hover lines
hoverLines.append("line")
  .attr("class", "infinite vertical")
  .attr("stroke", 'black')
  .attr("y1", height)

hoverLines.append("line")
  .attr("class", "infinite horizontal")
  .attr("stroke", 'black')
  .attr("x1", 0)

hoverLines.append("line")
  .attr("class", "finite vertical")
  .attr("stroke", 'blue')
  .attr("y1", height)

hoverLines.append("line")
  .attr("class", "finite horizontal")
  .attr("stroke", 'blue')
  .attr("x1", 0)

// handle mouseover event - draw hover lines
function handleMouseover(d, i) {
  let cls = d3.select(this).attr("class");
  let cx = d3.select(this).attr("cx");
  let cy = d3.select(this).attr("cy");

  hoverLines.select("."+cls+".vertical")
    .attr("x1", +cx)
    .attr("x2", +cx)
    .attr("y2", +cy+3.5)
    .attr('stroke-width', 1)

  hoverLines.select("."+cls+".horizontal")
    .attr("x2", +cx-3.5)
    .attr("y1", +cy)
    .attr("y2", +cy)
    .attr('stroke-width', 1)

  let hoverTickX = chart.select(".x.axis .hovertick")
      .attr('transform', 'translate(' + cx + ', 0)')
      .style('opacity', 1)

  let hoverTickY = chart.select(".y.axis .hovertick")
      .attr('transform', 'translate(0,' + cy + ')')
      .style('opacity', 1)

  hoverTickX.select('text')
    .text(i + '%')

  hoverTickY.select('text')
    .text(Math.round(d*10) / 10)

  let bboxX = hoverTickX.select('text')[0][0].getBBox()

  hoverTickX.select('rect')
    .attr('x', bboxX.x)
    .attr('y', bboxX.y)
    .attr('width', bboxX.width)
    .attr('height', bboxX.height)
    .attr('rx', bboxX.width*0.1)
    .attr('ry', bboxX.width*0.1)

  let bboxY = hoverTickY.select('text')[0][0].getBBox()

  hoverTickY.select('rect')
    .attr('x', bboxY.x)
    .attr('y', bboxY.y)
    .attr('width', bboxY.width)
    .attr('height', bboxY.height)
    .attr('rx', bboxY.width*0.1)
    .attr('ry', bboxY.width*0.1)

}

// handle mouseout event - remove hover lines
function handleMouseout(d, i) {
  let cls = d3.select(this).attr("class");

  hoverLines.selectAll("."+cls)
    .attr('stroke-width', 0)

  let hoverTickX = chart.select(".x.axis .hovertick")
      .style('opacity', 0)

  let hoverTickY = chart.select(".y.axis .hovertick")
      .style('opacity', 0)
}

function update(rr, rw, yearsToLast) {
  // data
  data = calcData(rr, rw, yearsToLast);

  // setup x-scaling
  var xScale = d3.scale.linear().range([0, width])
  var xMap = function(d, i) { return xScale(i / 100) }
  var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

  // setup y-scaling
  var yScale = d3.scale.linear().range([height, 0])
  var yMap = function(d) { return yScale(d) }
  var yAxis = d3.svg.axis().scale(yScale).orient('left');

  var maxNumYears = d3.max([d3.max(data.nYearsInfinite), d3.max(data.nYearsFinite)])
  xScale.domain([0, d3.max(data.savingsRates)])
  yScale.domain([0, maxNumYears])

  // bind data to circles
  var foreverPoints = foreverGroup.selectAll("circle")
      .data(data.nYearsInfinite)

  var finitePoints = finiteGroup.selectAll("circle")
      .data(data.nYearsFinite)

  foreverPoints.enter().append("circle")
      .attr("class", "infinite")
      .attr("r", 3.5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .on("mouseover", handleMouseover)
      .on("mouseout", handleMouseout)

  finitePoints.enter().append("circle")
      .attr("class", "finite")
      .attr("r", 3.5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style('fill', 'blue')
      .on("mouseover", handleMouseover)
      .on("mouseout", handleMouseout)

  foreverPoints.transition().duration(750).attr("cy", yMap);
  finitePoints.transition().duration(750).attr("cy", yMap);
  chart.select(".x.axis").transition().duration(750).call(xAxis);
  chart.select(".y.axis").transition().duration(750).call(yAxis);
}

update(initReturnRate, initWithdrawalRate, initYearsToLast);

let hoverTickX = chart.select(".x.axis").select(function() {
  return this.appendChild(chart.select(".x.axis .tick")[0][0].cloneNode(true));
})
    .attr('class', 'hovertick')
    .attr('transform', 'translate(0, 0)')
    .style('opacity', '0')

hoverTickX.insert("rect", 'text')
  .attr('fill', 'black')

let hoverTickY = chart.select(".y.axis").select(function() {
  return this.appendChild(chart.select(".y.axis .tick")[0][0].cloneNode(true));
})
    .attr('class', 'hovertick')
    .attr('transform', 'translate(0, 0)')
    .style('opacity', '0')

hoverTickY.insert("rect", 'text')
  .attr('fill', 'black')
