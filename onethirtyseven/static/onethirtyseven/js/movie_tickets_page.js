var parseDate = d3.time.format("%m/%d/%y").parse;
var dollar = d3.format("$,");
var percent = d3.format(".2%");
var comma = d3.format(",2")
var formatDate = d3.time.format("%m/%d/%y")
var bisectYear = d3.bisector(function(d) { return d.year; }).right; // **

function drawMovieTicketsGraph() {

    var margin = {top: 40, right: 20, bottom: 30, left: 30},
      width = 700 - margin.left - margin.right, // adjusted width (from 860) to fit new page formatting
      height = 300 - margin.top - margin.bottom, // adjusted height (from 400) to fit new page formatting
      barPadding = 0.5;

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(10, "0");
        // .tickFormat(d3.time.format("%Y"));

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10, "$,");

    var avg_ticket_price_line = d3.svg.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.avg_ticket_price); });

    var avg_ticket_price_infl_adj_line = d3.svg.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.avg_ticket_price_infl_adj); });

    var svg = d3.select("#movie_tickets_graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("opacity", 0.9)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var lineSvg = svg.append("g");

    var focus = svg.append("g")                                // **********
        .style("display", "none");                             // **********

    var dataset = js_data;

    function getPrice(json, year) {
        for (var i = 0; i < json.length; i++) {
            if(json[i].year == year) {
                return json[i].avg_ticket_price;
            }
        }
    }

    function getPriceInflAdj(json, year) {
        for (var i = 0; i < json.length; i++) {
            if(json[i].year == year) {
                return json[i].avg_ticket_price_infl_adj;
            }
        }
    }
    // var movie = movie_name;

      // dataset.forEach(function(d) {
      //     d.year = +d.year;
      //     d.tickets_sold_adj = +d.tickets_sold_adj;
      //     d.avg_ticket_price = +d.avg_ticket_price;
      //     d.avg_ticket_price_infl_adj = +d.avg_ticket_price_infl_adj;
      //     d.tickets_sold_adj_change = +d.tickets_sold_adj_change;
      //     d.avg_ticket_price_change = +d.avg_ticket_price_change;
      //     d.avg_ticket_price_infl_adj_change = +d.avg_ticket_price_infl_adj_change;
      // });
      

    x.domain(d3.extent(dataset, function(d) { return d.year; }));
    y.domain([0, d3.max(dataset, function(d) { return d.avg_ticket_price_infl_adj; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .style("opacity", 1)
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .style("opacity", 1)
        .call(yAxis);

    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        // .style("text-decoration", "underline")  
        .text("Average Ticket Price");

    svg.append("path")
        .datum(dataset)
        .attr("class", "line")
        .attr("id", "price")
        .attr("d", avg_ticket_price_line);

    svg.append("path")
        .datum(dataset)
        .attr("class", "line")
        .attr("id", "price_infl_adj")
        .attr("d", avg_ticket_price_infl_adj_line);

    svg.append("text")
        .attr("class", "label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 6)
        .text("Year");

    svg.append("text")
        .attr("class", "label")
        .attr("text-anchor", "end")
        .attr("x", -158)
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Ticket Price ($)");


    // append the circle at the intersection               // **********
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
        var i0 = d3.round(x0)
        var y0 = getPrice(dataset, i0)
        var y1 = getPriceInflAdj(dataset, i0)
        focus.select("circle.y0")             
            .attr("transform",               
                  "translate(" + x(i0) + "," +
                                 y(y0) + ")")
        focus.select("circle.y1")             
            .attr("transform",               
                  "translate(" + x(i0) + "," +
                                 y(y1) + ")")

        focus.select(".x")
          .attr("transform",
                "translate(" + x(i0) + "," +
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
                               y(y1) + ")")
                     .attr("x2", width + width);
        d3.select("#tooltip")
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY - 100 + "px")
                .attr("class", "")
                .style("opacity", 1)
                .select("#value")
                .html(i0 + "<br>" + i0 + " base - " + dollar(y0) + "<br>" + "2014 base - " + dollar(y1));
    }                                 
}

function drawMovieTicketsChangeGraph() {

    var margin = {top: 40, right: 20, bottom: 30, left: 40},
      width = 700 - margin.left - margin.right, // adjusted width (from 860) to fit new page formatting
      height = 300 - margin.top - margin.bottom, // adjusted height (from 400) to fit new page formatting
      barPadding = 0.5;

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(10, "0");
        // .tickFormat(d3.time.format("%Y"));

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10, "%");

    var avg_ticket_price_line = d3.svg.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.avg_ticket_price_change); });

    var avg_ticket_price_infl_adj_line = d3.svg.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.avg_ticket_price_infl_adj_change); });

    var svg = d3.select("#movie_tickets_change_graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("opacity", 0.9)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var lineSvg = svg.append("g");

    var focus = svg.append("g")                                // **********
        .style("display", "none");                             // **********

    var dataset = js_data;

    function getPrice(json, year) {
        for (var i = 0; i < json.length; i++) {
            if(json[i].year == year) {
                return json[i].avg_ticket_price_change;
            }
        }
    }

    function getPriceInflAdj(json, year) {
        for (var i = 0; i < json.length; i++) {
            if(json[i].year == year) {
                return json[i].avg_ticket_price_infl_adj_change;
            }
        }
    }
    // var movie = movie_name;

      // dataset.forEach(function(d) {
      //     d.year = +d.year;
      //     d.tickets_sold_adj = +d.tickets_sold_adj;
      //     d.avg_ticket_price = +d.avg_ticket_price;
      //     d.avg_ticket_price_infl_adj = +d.avg_ticket_price_infl_adj;
      //     d.tickets_sold_adj_change = +d.tickets_sold_adj_change;
      //     d.avg_ticket_price_change = +d.avg_ticket_price_change;
      //     d.avg_ticket_price_infl_adj_change = +d.avg_ticket_price_infl_adj_change;
      // });
      

    x.domain(d3.extent(dataset, function(d) { return d.year; }));
    y.domain([-0.1, 0.1]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .style("opacity", 1)
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .style("opacity", 1)
        .call(yAxis);

    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        // .style("text-decoration", "underline")  
        .text("Average Ticket Price - % Change");

    svg.append("text")
        .attr("class", "label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 6)
        .text("Year");

    svg.append("text")
        .attr("class", "label")
        .attr("text-anchor", "end")
        .attr("x", -145)
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("% Change in Price");

    svg.append("path")
        .datum(dataset)
        .attr("class", "line")
        .attr("id", "price")
        .attr("d", avg_ticket_price_line);

    svg.append("path")
        .datum(dataset)
        .attr("class", "line")
        .attr("id", "price_infl_adj")
        .attr("d", avg_ticket_price_infl_adj_line);

    // append the circle at the intersection               // **********
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
        var i0 = d3.round(x0)
        var y0 = getPrice(dataset, i0)
        var y1 = getPriceInflAdj(dataset, i0)
        focus.select("circle.y0")             
            .attr("transform",               
                  "translate(" + x(i0) + "," +
                                 y(y0) + ")")
        focus.select("circle.y1")             
            .attr("transform",               
                  "translate(" + x(i0) + "," +
                                 y(y1) + ")")

        focus.select(".x")
          .attr("transform",
                "translate(" + x(i0) + "," +
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
                               y(y1) + ")")
                     .attr("x2", width + width);
        d3.select("#tooltip")
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY - 100 + "px")
                .attr("class", "")
                .style("opacity", 1)
                .select("#value")
                .html(i0 + "<br>" + i0 + " base: " + percent(y0) + "<br>" + "2014 base: " + percent(y1));
    }                                 
}

function drawMovieTicketsSoldGraph() {

    var margin = {top: 40, right: 20, bottom: 30, left: 40},
      width = 700 - margin.left - margin.right, // adjusted width (from 860) to fit new page formatting
      height = 300 - margin.top - margin.bottom, // adjusted height (from 400) to fit new page formatting
      barPadding = 0.5;

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(10, "0");
        // .tickFormat(d3.time.format("%Y"));

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);

    var avg_ticket_price_line = d3.svg.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.tickets_sold_adj); });

    // var avg_ticket_price_infl_adj_line = d3.svg.line()
    //     .x(function(d) { return x(d.year); })
    //     .y(function(d) { return y(d.avg_ticket_price_infl_adj_change); });

    var svg = d3.select("#movie_tickets_sold_graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("opacity", 0.9)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var lineSvg = svg.append("g");

    var focus = svg.append("g")                                // **********
        .style("display", "none");                             // **********

    var dataset = js_data;

    function getPrice(json, year) {
        for (var i = 0; i < json.length; i++) {
            if(json[i].year == year) {
                return json[i].tickets_sold_adj;
            }
        }
    }

    // function getPriceInflAdj(json, year) {
    //     for (var i = 0; i < json.length; i++) {
    //         if(json[i].year == year) {
    //             return json[i].avg_ticket_price_infl_adj_change;
    //         }
    //     }
    // }
    // var movie = movie_name;

      // dataset.forEach(function(d) {
      //     d.year = +d.year;
      //     d.tickets_sold_adj = +d.tickets_sold_adj;
      //     d.avg_ticket_price = +d.avg_ticket_price;
      //     d.avg_ticket_price_infl_adj = +d.avg_ticket_price_infl_adj;
      //     d.tickets_sold_adj_change = +d.tickets_sold_adj_change;
      //     d.avg_ticket_price_change = +d.avg_ticket_price_change;
      //     d.avg_ticket_price_infl_adj_change = +d.avg_ticket_price_infl_adj_change;
      // });
      

    x.domain(d3.extent(dataset, function(d) { return d.year; }));
    y.domain([0, d3.max(dataset, function(d) { return d.tickets_sold_adj })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .style("opacity", 1)
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .style("opacity", 1)
        .call(yAxis);

    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        // .style("text-decoration", "underline")  
        .text("Number of Tickets Sold (Millions)");

    svg.append("text")
        .attr("class", "label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 6)
        .text("Year");

    svg.append("text")
        .attr("class", "label")
        .attr("text-anchor", "end")
        .attr("x", -125)
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("# of Tickets Sold (mm)");

    svg.append("path")
        .datum(dataset)
        .attr("class", "line")
        .attr("id", "price")
        .attr("d", avg_ticket_price_line);

    // svg.append("path")
    //     .datum(dataset)
    //     .attr("class", "line")
    //     .attr("id", "price_infl_adj")
    //     .attr("d", avg_ticket_price_infl_adj_line);


    // append the circle at the intersection               // **********
    focus.append("circle")                                 // **********
        .attr("class", "y0")                                // **********
        .style("fill", "none")                             // **********
        .style("stroke", "steelblue")                           // **********
        .attr("r", 4);                                     // **********

    // focus.append("circle")                                 // **********
    //     .attr("class", "y1")                                // **********
    //     .style("fill", "none")                             // **********
    //     .style("stroke", "red")                           // **********
    //     .attr("r", 4);                                     // **********

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

    // focus.append("line")
    //     .attr("class", "y1")
    //     .style("stroke", "red")
    //     // .style("stroke-dasharray", "3,3")
    //     .style("opacity", 0.5)
    //     .attr("x1", width)
    //     .attr("x2", width);

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
        var i0 = d3.round(x0)
        var y0 = getPrice(dataset, i0)
        // var y1 = getPriceInflAdj(dataset, i0)
        focus.select("circle.y0")             
            .attr("transform",               
                  "translate(" + x(i0) + "," +
                                 y(y0) + ")")
        // focus.select("circle.y1")             
        //     .attr("transform",               
        //           "translate(" + x(i0) + "," +
        //                          y(y1) + ")")

        focus.select(".x")
          .attr("transform",
                "translate(" + x(i0) + "," +
                               y(y0) + ")")
                     .attr("y2", height - y(y0));

        focus.select("line.y0")
          .attr("transform",
                "translate(" + width * -1 + "," +
                               y(y0) + ")")
                    .attr("x2", width + width);
        // focus.select("line.y1")
        //   .attr("transform",
        //         "translate(" + width * -1 + "," +
        //                        y(y1) + ")")
        //              .attr("x2", width + width);
        d3.select("#tooltip")
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY - 100 + "px")
                .attr("class", "")
                .style("opacity", 1)
                .select("#value")
                .html(i0 + "<br>" + comma(y0))
    }                                 
}

drawMovieTicketsGraph()
drawMovieTicketsChangeGraph()
drawMovieTicketsSoldGraph()