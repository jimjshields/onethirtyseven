var parseDate = d3.time.format("%m/%d/%y").parse;
var dollar = d3.format("$,");
var formatDate = d3.time.format("%m/%d/%y")

var margin = {top: 10, right: 20, bottom: 30, left: 70},
  width = 700 - margin.left - margin.right, // adjusted width (from 860) to fit new page formatting
  height = 300 - margin.top - margin.bottom, // adjusted height (from 400) to fit new page formatting
  barPadding = 0.5;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(8, ",");
    // .tickFormat(d3.time.format("%b-%Y"));

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10, "$,");

var svg = d3.select("#daily_graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("opacity", 0.9)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dataset = js_data;
var movie = movie_name;

dataset.forEach(function(d) {
  d.date = parseDate(d.date);
  d.gross = +d.gross;
  d.days = +d.days
});


x.domain(d3.extent(dataset, function(d) { return d.days; })); // number of days - for head-to-head comparison
y.domain([0, d3.max(dataset, function(d) { return d.gross; })]);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .style("opacity", 1)
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .style("opacity", 1)
    .call(yAxis);

svg.selectAll(".bar")
    .data(dataset.filter(function(d) { return d.movie == movie_1 }))
  .enter().append("rect")
    .attr("class", "bar")
    .attr("class", "bar_1")
    .attr("x", function(d) { return x(d.days); })
    .attr("width", ((width / d3.max(dataset, function(d) { return d.days })) - barPadding))
    .attr("y", function(d) { return y(d.gross); })
    .attr("height", function(d) { return height - y(d.gross); })
    .style("opacity", 1)
    .on("mousemove", function (d) {
        d3.select("#tooltip")
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY - 100 + "px")
            .attr("class", "")
            .style("opacity", 1)
            .select("#value")
            .text("Day " + d.days + " - " + dollar(d.gross));
    })
    .on("mouseout", function () {
    // Hide the tooltip
    d3.select("#tooltip")
      .style("opacity", 0);;
    });

svg.selectAll(".bar")
    .data(dataset.filter(function(d) { return d.movie == movie_2 }))
  .enter().append("rect")
    .attr("class", "bar")
    .attr("class", "bar_2")
    .attr("x", function(d) { return x(d.days); })
    .attr("width", ((width / d3.max(dataset, function(d) { return d.days })) - barPadding))
    .attr("y", function(d) { return y(d.gross); })
    .attr("height", function(d) { return height - y(d.gross); })
    .style("opacity", 1)
    .on("mousemove", function (d) {
        d3.select("#tooltip")
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY - 100 + "px")
            .attr("class", "")
            .style("opacity", 1)
            .select("#value")
            .text("Day " + d.days + " - " + dollar(d.gross));
    })
    .on("mouseout", function () {
    // Hide the tooltip
    d3.select("#tooltip")
      .style("opacity", 0);;
    });