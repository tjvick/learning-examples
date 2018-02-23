// var selection = d3.select('#chart').selectAll(".bar");
// selection.style("height", "40px");

var numbers = [15, 8, 42, 4, 32];
// var selection = d3.select("#chart")
//   .selectAll(".bar")
//   .data(numbers)
//   .style("height", function(d) {return d + "px"})
//   .style("margin-top", function(d) {return (100-d) + "px"})

function update() {

  var selection = d3
    .select("#chart")
    .selectAll(".bar")
    .data(numbers)
    .style("height", function(d) { return d + "px"})
    .style("margin-top", function(d) {return (100-d) + "px"})

  selection
    .enter()
    .append("div")
    .attr("class", "bar")
    .style("height", function(d) { return d + "px"})
    .style("margin-top", function(d) {return (100-d) + "px"})
    .on("click", function(e, i) {
      numbers.splice(i, 1);
      update();
    })

  selection.exit().remove();
}

update();
