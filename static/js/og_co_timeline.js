/* global $, _, crossfilter, d3  */
(function(ogCoApp){
  'use strict';

  var chartHolder = d3.select('#timeline');

  var margin = {top:20, right:20, bottom:60, left:20};
  var boundingRect = chartHolder.node().getBoundingClientRect();
  var width = boundingRect.width - margin.left - margin.right,
      height = boundingRect.height - margin.top - margin.bottom;

  var svg = chartHolder.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate("+margin.left+","+margin.top+")");

  var xScale = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.1)
    .domain(d3.range(1870,2015));

  var yScale = d3.scale.ordinal()
    .rangeRoundPoints([height, 0])
    .domain(d3.range(10));

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .tickValues(xScale.domain().filter(function(d,i){
      return !(d%10);
    }));

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0,"+height+")")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "1em");

  var myLabel = chartHolder.select("svg").append("g")
    .attr("transform", "translate(10,10)")
    .attr("class", "labels")
    .selectAll("label").data(['Inception decade'])
    .enter().append("g")
    .attr("tranform", function(d,i){
      return "translate(0,"+ i*10 +")";
    });

  myLabel.append("text")
    .text('Decade of inception')
    .attr("dy", "2em")
    .attr("x", 20)



  ogCoApp.updateTimeChart = function(data){


    var years = svg.selectAll(".year")
      .data(data, function(d){
        return d.key;
      });

    years.enter().append("g")
      .classed("year", true)
      .attr("name", function(d){return d.key})
      .attr("transform", function(year){
        return "translate("+xScale(+year.key)+",0)";
      });

    years.exit().remove();

    var inceptions = years.selectAll(".inception")
      .data(function(d){
        return d.values;
      }, function(d){
        return d.name;
      });

    inceptions.enter().append("circle")
      .classed("inception", true)
      .attr("cy", height )
      .attr("cx", xScale.rangeBand()/2 )
      .attr("r", xScale.rangeBand());


    inceptions
      .transition().duration(2000)
      .attr("cy", function(d,i){
        return yScale(i);
      });

    inceptions.exit().remove();


  }


}(window.ogCoApp = window.ogCoApp || {}))