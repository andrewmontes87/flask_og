/* global $, _, crossfilter, d3  */
(function(ogCoApp){
  'use strict';

    
  var chartHolder = d3.select('#bar');
    
    var margin = {top:40, right:200, bottom:20, left:20};
    var boundingRect = chartHolder.node().getBoundingClientRect();
    var width = boundingRect.width - margin.left - margin.right,
    height = boundingRect.height - margin.top - margin.bottom;
	    // width = parseInt(chartHolder.style('width')) - margin.left - margin.right,
	    // height = parseInt(chartHolder.style('height')) - margin.top - margin.bottom;
    var xPaddingLeft = 0;//10;
    var yPaddingTop = 0;//10;

    // SCALES
    var yScale = d3.scale.ordinal()
        // .rangeRoundBands([0, width], 0.1, 1.4);
        .rangeBands([yPaddingTop, height], 0.1);

    var xScale = d3.scale.linear()
        .range([width, 0]);

    // AXES
    var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('top')
            .ticks(10)
            .tickFormat(function(d) {
//                 if(ogCoApp.valuePerCapita){
//                     return d.toExponential();
//                 }
                return d;
            });

    var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('right');

    // build the chart
    var svg = chartHolder.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // ADD AXES
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate("+width+",0)");
    
    svg.append("g")
        .attr("class", "x axis")
        .append("text")
        .attr('id', 'x-axis-label')

    
    ogCoApp.updateBarChart = function(data) {
        data = data.filter(function(d) {
            return d.value > 0;
        });

        xScale.domain([0, d3.max(data, function(d) { return +d.value; })]);
        yScale.domain( data.map(function(d) { return d.key; }) );

        svg.select('.y.axis')
            .transition().duration(ogCoApp.TRANS_DURATION)
            .call(yAxis)
            .selectAll("text")  
            // .style("text-anchor", "end")
            .style("text-align", "left")
            // .attr("dy", "-.8em")
            .attr("dx", "1em")
            // .attr("transform", function(d) {
            //     return "rotate(-65)"; 
            // });

        svg.select('.x.axis')
            .transition().duration(ogCoApp.TRANS_DURATION)
            .call(xAxis);

        var xLabel = svg.select('#x-axis-label');
        xLabel.text("Revenue (US$ BILLION)");

        var bars = svg.selectAll(".bar")
            .data(data, function(d) {
                return d.key;
            });
        
        bars.enter().append("rect")
            .attr("class", "bar")
            .attr("y", yPaddingTop)
            .on('click', function(d){
                ogCoApp.displayPopup(d);
            });
        
        bars
            // .classed('active', function(d) {
            //     return d.key === ogCoApp.activeCountry;
            // })
            .transition().duration(ogCoApp.TRANS_DURATION)
            .attr("x", function(d) { return xScale(d.value); })
            .attr("width", function(d) { return width - xScale(d.value); })
            .attr("y", function(d) { return yScale(d.key); })
            .attr("height", yScale.rangeBand());
            
        

        bars.exit().remove();



    };
        
}(window.ogCoApp = window.ogCoApp || {}));

