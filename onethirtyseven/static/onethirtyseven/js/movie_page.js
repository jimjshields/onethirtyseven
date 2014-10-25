var parseDate = d3.time.format("%m/%d/%y").parse;
var dollar = d3.format("$,");
var formatDate = d3.time.format("%m/%d/%y")


function drawMovieGraph() {
    var margin = {top: 10, right: 20, bottom: 30, left: 80},
      width = 700 - margin.left - margin.right, // adjusted width (from 860) to fit new page formatting
      height = 300 - margin.top - margin.bottom, // adjusted height (from 400) to fit new page formatting
      barPadding = 0.5;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, height/2 + 10]);

    var y2 = d3.scale.linear()
        .range([height/2 - 10, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(5)
        .tickFormat(d3.time.format("%b-%Y"));

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(5, "$,");

    var yAxis2 = d3.svg.axis()
        .scale(y2)
        .orient("left")
        .ticks(5, "$,");

    var cumul_gross_line = d3.svg.line() // added the total gross line
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y2(d.total_gross); });

    var svg = d3.select("#daily_graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("opacity", 0.9)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var focus = svg.append("g")                                // **********
        .style("display", "none");                             // **********

    function getPrice(json, date) {
        for (var i = 0; i < json.length; i++) {
            if(formatDate(json[i].date) == date) {
                return json[i].gross;
            }
        }
    }

    function getPriceInflAdj(json, date) {
        for (var i = 0; i < json.length; i++) {
            if(formatDate(json[i].date) == date) {
                return json[i].total_gross;
            }
        }
    }

    // var lineSvg = d3.select("#cumul_gross_graph").append("svg")

    var dataset = js_data;
    var movie = movie_name;

    dataset.forEach(function(d) {
      d.date = parseDate(d.date);
      d.gross = +d.gross;
      d.total_gross = +d.total_gross;
      d.days = +d.days;
    });

    x.domain(d3.extent(dataset, function(d) { return d.date; }));
    y.domain([0, d3.max(dataset, function(d) { return d.gross; })]);
    y2.domain([0, d3.max(dataset, function(d) { return d.total_gross; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .style("opacity", 1)
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .style("opacity", 1)
        .call(yAxis);

    svg.append("g")
        .attr("class", "y axis")
        .style("opacity", 1)
        .call(yAxis2);

    svg.append("path")
        .datum(dataset)
        .attr("class", "line")
        .attr("id", "cumul_gross_line")
        .attr("d", cumul_gross_line);

    svg.selectAll(".bar")
        .data(dataset)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.date); })
        .attr("width", (width / d3.max(dataset, function(d) { return d.days })) - barPadding)
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
                .text(formatDate(d.date) + " - " + dollar(d.gross));
        })
        .on("mouseout", function () {
        // Hide the tooltip
        d3.select("#tooltip")
          .style("opacity", 0);;
        });

    focus.append("circle")                                 // **********
        .attr("class", "y0")                                // **********
        .style("fill", "none")                             // **********
        .style("stroke", "steelblue")                           // **********
        .attr("r", 4);                                     // **********

    focus.append("circle")                                 // **********
        .attr("class", "y1")                                // **********
        .style("fill", "none")                             // **********
        .style("stroke", "red")                           // **********
        .attr("r", 4);                                     // **********

    // append the x line
    focus.append("line")
        .attr("class", "x")
        .style("stroke", "steelblue")
        // .style("stroke-dasharray", "3,3")
        .style("opacity", 0.5)
        .attr("y1", 0)
        .attr("y2", height);

    // append the y line
    focus.append("line")
        .attr("class", "y0")
        .style("stroke", "steelblue")
        // .style("stroke-dasharray", "3,3")
        .style("opacity", 0.5)
        .attr("x1", width)
        .attr("x2", width);

    focus.append("line")
        .attr("class", "y1")
        .style("stroke", "red")
        // .style("stroke-dasharray", "3,3")
        .style("opacity", 0.5)
        .attr("x1", width)
        .attr("x2", width);

    // append the rectangle to capture mouse               // **********
    svg.append("rect")                                     // **********
        .attr("width", width)                              // **********
        .attr("height", height)                            // **********
        .style("fill", "none")                             // **********
        .style("pointer-events", "all")                    // **********
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);                       // **********

    function mousemove() {                                 // **********
        var x0 = x.invert(d3.mouse(this)[0])               // *********
        var i0 = formatDate(x0)
        var y0 = getPrice(dataset, i0)
        var y1 = getPriceInflAdj(dataset, i0)

        focus.select("circle.y0")             
            .attr("transform",               
                  "translate(" + x(parseDate(i0)) + "," +
                                 y(y0) + ")")
        focus.select("circle.y1")             
            .attr("transform",               
                  "translate(" + x(parseDate(i0)) + "," +
                                 y2(y1) + ")")

        focus.select(".x")
          .attr("transform",
                "translate(" + x(parseDate(i0)) + "," +
                               y(y1) + ")")
                     .attr("y2", height - y(y1));

        focus.select("line.y0")
          .attr("transform",
                "translate(" + width * -1 + "," +
                               y(y0) + ")")
                    .attr("x2", width + width);
        focus.select("line.y1")
          .attr("transform",
                "translate(" + width * -1 + "," +
                               y2(y1) + ")")
                     .attr("x2", width + width);
        d3.select("#tooltip")
                .style("left", d3.event.pageX + 50 + "px")
                .style("top", d3.event.pageY - 120 + "px")
                .attr("class", "")
                .style("opacity", 1)
                .select("#value")
                .html(i0 + "<br>" + "Daily - " + dollar(y0) + "<br>" + "Cumulative - " + dollar(y1));
    }
};

drawMovieGraph();