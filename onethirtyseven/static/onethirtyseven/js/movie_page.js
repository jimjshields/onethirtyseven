// key
// ??? - what does this do?
//// grouped section heading, function description ////
// functionality heading

//// formatting variables ////

var parseDate = d3.time.format("%m/%d/%y").parse; // parses input date data so d3 can read it as date
var dollar = d3.format("$,"); // formats output as dollar - displays to end user
var formatDate = d3.time.format("%m/%d/%y") // formats output as date - displays to end user


//// functions to get the coordinates for the interactive lines/circles ////

function getGross(json, date) {
    //// given a json dataset and a date, return 'gross' from the json - used for first graph ////

    for (var i = 0; i < json.length; i++) { // go through all json objects
        if(formatDate(json[i].date) == date) { // if the object date matches the given date
            return json[i].gross; // return the associated gross
        }
    }
}

function getTotalGross(json, date) {
    // given a json dataset and a date, return 'gross' from the json - used for second graph

    for (var i = 0; i < json.length; i++) { // go through all json objects
        if(formatDate(json[i].date) == date) { // if the object date matches the given date
            return json[i].total_gross; // return the associated total gross
        }
    }
}


function loadData() {
    //// the json dataset is given through the page itself - python returns a json object, django passes it to html, html passes it to this ////

    var dataset = js_data;

    // go through the dataset and force the type of the variables

    dataset.forEach(function(d) { // for each object in the dataset
      d.date = parseDate(d.date); // parse the date
      d.gross = +d.gross; // force the gross to be a number
      d.total_gross = +d.total_gross; // force the total gross to be a number
      d.days = +d.days; // force the number of days to be a number
    });

    return dataset // return the new dataset
}

function svgDimensions() {
    //// set up the margins and dimensions of svg ////

    var margin = {top: 10, right: 20, bottom: 30, left: 80}; // margin for the svg, accessed in svg variable
    var width = 700 - margin.left - margin.right; // adjusted width of svg (from 860) to fit new page formatting
    var height = 300 - margin.top - margin.bottom; // adjusted height of svg (from 400) to fit new page formatting
    var barPadding = 0.5; // space between bars, in pixels   

    return [margin, width, height, barPadding]; // return an array of the variables, accessed in graphing function
}

function drawMovieGraph() {
    //// double graph function - line and bar graph with different y axes ////

    //// data ////

    // the dataset is loaded in the loadData function

    var dataset = loadData()

    // the name of the movie chosen - passed through django to html to this
    
    var movie = movie_name


    //// set up the margins and dimensions using svgDimensions function ////

    var margin = svgDimensions()[0]
    var width = svgDimensions()[1]
    var height = svgDimensions()[2]
    var barPadding = svgDimensions()[3]


    //// set up the svg using the above ////

    var svg = d3.select("#daily_graph").append("svg") // select the div with the specified ID
        .attr("width", width + margin.left + margin.right) // width of the svg
        .attr("height", height + margin.top + margin.bottom) // height of the svg
        .style("opacity", 0.9) // opacity of the entire svg, including any graphs
        .append("g") // append it
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // ???


    //// set up the scales ////

    // x axis scale - used for time/dates

    var x = d3.time.scale() // uses d3's time scale
        .range([0, width]); // range starts at 0, goes to width of svg

    // first y axis scale - used for linear sets (dollars, percentages)

    var y = d3.scale.linear() // uses d3's linear scale
        .range([height, height/2 + 10]); // adjusts range to take multiple (here, 2) y axes - this goes from the bottom (height) to the middle

    // second y axis scale - used for linear sets (dollars, percentages)

    var y2 = d3.scale.linear() // uses d3's linear scale
        .range([height/2 - 10, 0]); // adjusts range to take multiple (here, 2) y axes - this goes from the middle (height/2) to the top


    //// set the domains for the axes given the dataset ////

    // x domain

    x.domain(d3.extent(dataset, function(d) { return d.date; })); // first to last date in dataset

    // y domain

    y.domain([0, d3.max(dataset, function(d) { return d.gross; })]); // 0 to highest gross number in dataset

    // y2 domain

    y2.domain([0, d3.max(dataset, function(d) { return d.total_gross; })]); // 0 to highest gross number in dataset


    //// set up the axes ////

    // x axis

    var xAxis = d3.svg.axis() // declare it as a d3 axis
        .scale(x) // uses 'x', as defined above, as the scale
        .orient("bottom") // put it at the bottom of the svg
        .ticks(5) // approx. # of ticks - d3 uses # as a suggestion
        .tickFormat(d3.time.format("%b-%Y")); // format the axis as a date in the specified way

    // first y axis

    var yAxis = d3.svg.axis() // declare it as a d3 axis
        .scale(y) // uses 'y', as defined above, as the scale
        .orient("left") // put it on the left of the svg
        .ticks(5, "$,"); // approx. # of ticks - d3 uses # as a suggestion; this also declares the format as dollars

    // second y axis

    var yAxis2 = d3.svg.axis() // declare it as a d3 axis
        .scale(y2) // uses 'y2', as defined above, as the scale 
        .orient("left") // put it on the left of the svg
        .ticks(5, "$,"); // approx. # of ticks - d3 uses # as a suggestion; this also declares the format as dollars


    //// graphing ////


    //// draw axes ////

    // draw the x axis

    svg.append("g") // append to svg
        .attr("class", "x axis") // add class for css styling
        .attr("transform", "translate(0," + height + ")") // ???
        .call(xAxis); // get the data from xAxis variable

    // draw the y axis

    svg.append("g") // append to svg
        .attr("class", "y axis") // add class for css styling
        .call(yAxis); // get the data from yAxis variable

    // draw the second y axis

    svg.append("g") // append to svg
        .attr("class", "y axis") // add class for css styling
        .call(yAxis2); // get the data from yAxis variable


    //// graphs ////

    // declare line

    var cumul_gross_line = d3.svg.line() // declare it as a d3 line
        .x(function(d) { return x(d.date); }) // the x values of the line - coming from the data
        .y(function(d) { return y2(d.total_gross); }); // the y values of the line - coming from the data

    // draw the line

    svg.append("path") // append to svg
        .datum(dataset) // bind to dataset
        .attr("class", "line") // add class for css styling
        .attr("id", "cumul_gross_line") // add id for css styling
        .attr("d", cumul_gross_line); // ???

    // draw the bar graph

    svg.selectAll(".bar") // select all with 'bar' class (don't exist yet)
        .data(dataset) // bind to dataset
        .enter().append("rect") // enter data, append rectangles to them
        .attr("class", "bar") // add class for css styling (matches the select at the top)
        .attr("x", function(d) { return x(d.date); }) // x positioning of bar, gotten from data
        .attr("width", (width / d3.max(dataset, function(d) { return d.days })) - barPadding) // width of bar, gotten from width, size of dataset, and barPadding
        .attr("y", function(d) { return y(d.gross); }) // y positioning of bar, gotten from data
        .attr("height", function(d) { return height - y(d.gross); }) // height of bar, gotten from height and data


    //// layer over the actual graph - used for interactivity (circles and lines when hovering) ////

    var focus = svg.append("g") // append the layer to the svg
        .style("display", "none"); // set the css style to not display this layer - will be displayed when hovering


    //// elements on the second layer - display on hovering ////

    // circle on bar graph

    focus.append("circle") // append a circle
        .attr("class", "y0") // add class for css styling
        .style("fill", "none") // empty fill
        .style("stroke", "steelblue") // color of outline
        .attr("r", 4); // radius size in pixels

    // circle on line graph

    focus.append("circle") // append a second circle
        .attr("class", "y1") // add different class for css styling
        .style("fill", "none") // empty fill
        .style("stroke", "red") // color of outline
        .attr("r", 4); // radius size in pixels

    // vertical line for both graphs - corresponds to date hovered over

    focus.append("line") // append the line
        .attr("class", "x") // add class for css styling
        .style("stroke", "steelblue") // color of line
        .style("opacity", 0.5) // opacity
        .attr("y1", 0) // y position of top of line (doesn't work?)
        .attr("y2", height); // y position of bottom of line

    // horizontal line for bar graph

    focus.append("line") // append the line
        .attr("class", "y0") // add class for css styling
        .style("stroke", "steelblue") // color of line
        .style("opacity", 0.5) // opacity
        .attr("x1", width) // x position of the end of the line
        .attr("x2", width); // ???

    // horizontal line for line graph

    focus.append("line") // append the line
        .attr("class", "y1") // add class for css styling
        .style("stroke", "red") // color of line
        .style("opacity", 0.5) // opacity
        .attr("x1", width) // x position of the end of the line
        .attr("x2", width); // ???


    //// append rectangle to capture mouse movements ////

    svg.append("rect") // append rectangle
        .attr("width", width) // svg width
        .attr("height", height) // svg height
        .style("fill", "none") // empty fill
        .style("pointer-events", "all") // capture all mouse events
        .on("mouseover", function() { focus.style("display", null); }) // ???
        .on("mouseout", function() { focus.style("display", "none"); }) // ???
        .on("mousemove", mousemove); // ???


    //// function to capture mouse coordinates and display lines and tooltip ////

    function mousemove() {

        // datapoints assoc. with the x/y coordinates of the mouse

        var x0 = x.invert(d3.mouse(this)[0]) // given x coord., return datapoint assoc. w/ that coord.
        var i0 = formatDate(x0) // format the datapoint as a date
        var y0 = getGross(dataset, i0) // get the gross assoc. with that date
        var y1 = getTotalGross(dataset, i0) // get the total gross assoc. with that date

        // circle for the bar graph

        focus.select("circle.y0") // select the circle (already there)             
            .attr("transform", "translate(" // set the x/y coord. of the circle
                + x(parseDate(i0)) + "," // x coord. at the date
                + y(y0) + ")"); // y coord. at the top of the bar for that date

        // circle for the line graph

        focus.select("circle.y1") // select the circle (already there)             
            .attr("transform", "translate(" // set the x/y coord. of the circle
                + x(parseDate(i0)) + "," // x coord. at the date
                + y2(y1) + ")"); // y coord. on the line for that date

        // vertical line

        focus.select(".x") // select class x
            .attr("transform", "translate(" // set the x/y coord. of the line
                + x(parseDate(i0)) + "," // x coord. at the date
                + y(y1) + ")") // ???
            .attr("y2", height - y(y1)); // ???

        // horizontal line for bar graph

        focus.select("line.y0") // select class y0
            .attr("transform", "translate(" // set the x/y coord. of the line
                + width * -1 + "," // ???
                + y(y0) + ")") // y coord. at the height of bar
            .attr("x2", width + width); // ???

        // horizontal line for line graph

        focus.select("line.y1") // select class y1
            .attr("transform", "translate(" // set the x/y coord. of the line
                + width * -1 + "," // ???
                + y2(y1) + ")") // y coord. on line
            .attr("x2", width + width); // ???

        // add the tooltip

        d3.select("#tooltip") // select div id
            .style("left", d3.event.pageX + 50 + "px") // put it 50 px to the right of the mouse 
            .style("top", d3.event.pageY - 120 + "px") // put it 120 px above the mouse
            .attr("class", "") // ???
            .style("opacity", 1) // opacity of 1
            .select("#value") // select value of the div
            .html(i0 + "<br>" + "Cumulative - " + dollar(y1) + "<br>" + "Daily - " + dollar(y0)); // insert text as html into the div - is this safe? (i.e., inserting html)
    }
};

drawMovieGraph(); // call the function to draw the graph