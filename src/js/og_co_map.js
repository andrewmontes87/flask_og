/* global $, _, crossfilter, d3  */
(function(ogCoApp){
  'use strict';

  var mapContainer = d3.select('#map');
  var boundingRect = mapContainer.node().getBoundingClientRect();
  var width = boundingRect.width,
      height = boundingRect.height;
  var svg = mapContainer.append('svg');

  var projection = d3.geo.equirectangular()
    .scale(100 * (height/275))
    .center([10,0])
    .translate([width/2, height/2])
    .precision(0.1);

  var path = d3.geo.path()
    .projection(projection);

  var graticule = d3.geo.graticule()
    .step([20,20]);
  svg.append('path')
    .datum(graticule)
    .attr('class','graticule')
    .attr('d', path);

  var radiusScale = d3.scale.sqrt()
    .domain([1,500])
    .range([ogCoApp.MIN_CENTROID_RADIUS, ogCoApp.MAX_CENTROID_RADIUS]);

  var cnameToCountry = {};


  ogCoApp.initMap = function(world, names){

    var land = topojson.feature(world, world.objects.land),
      countries = topojson
        .feature(world, world.objects.countries)
        .features,
      borders = topojson
        .mesh(world, world.objects.countries, function(a,b){
          return a !== b;
        });
    
    svg.insert('path', '.graticule')
      .datum(land)
      .attr('class', 'land')
      .attr('d', path);

    svg.insert('g', '.graticule')
      .attr('class','countries');
    svg.insert('g')
      .attr('class', 'centroids');
    svg.insert('path', '.graticule')
      .datum(borders)
      .attr('class', 'boundary')
      .attr('d', path);

    svg
    .append("g")
    .append('circle')
    .attr("cx", 40)
    .attr("cy", (height-40)+'px')
    .attr("class", "centroid")
    .attr('r', function(d) {
      var hundred_billion = 100
       return Math.sqrt(hundred_billion*10);
    })
    svg
    .append("g")
    .append("text")
    .text(' = $100 BILLION USD Revenue')
    .style("font-size", "1.5em")
    .style('fill', '#434343')
    .attr("x", 80)
    .attr("y", (height-35)+'px')

    var idToCountry = {};
    countries.forEach(function(c){
      idToCountry[c.id] = c;
    });

    names.forEach(function(n){
      cnameToCountry[n.name] = idToCountry[n.id];
    });

  };


  var tooltip = d3.select('#map-tooltip');

  ogCoApp.updateMap = function(countryData, locData) {
    var mapData = countryData.filter(function(d){
      return d.value>0;
    })
    .map(function(d) {
      return {
        geo: cnameToCountry[d.key],
        name: d.key,
        number: d.value,
        revenue: d.revenue
      }
    });

    var mapCompanyData = locData.filter(function(l){
      return l.coordinate_location;
    })
    .sort(function(a,b){ return b.revenue - a.revenue });






    var countries = svg.select('.countries').selectAll('.country')
      .data(mapData, function(d){
        return d.name;
      });

    countries.enter()
      .append('path')
      .attr('class','country')
      // .on('mouseenter', function(d){
      //   d3.select(this).classed('active',true);
      // })
      // .on('mouseout', function(d){
      //   d3.select(this).classed('active',false);
      // });

    countries
      .attr('name', function(d){
        return d.name;
      })
      .classed('visible',true)
      .transition().duration(ogCoApp.TRANS_DURATION)
      .style('opacity', 1)
      .attr('d', function(d){
        return path(d.geo);
      });

    countries.exit()
      .classed('visible',false)
      .transition().duration(ogCoApp.TRANS_DURATION)
      .style('opacity', 0);



    var getCentroid = function(d) {
      var arr = d.coordinate_location.split(",")
      arr[1] = arr[1].trim()
      return projection([arr[1], arr[0]]);
    }

    var centroids = svg.select('.centroids')
      .selectAll('.centroid')
      .data(mapCompanyData,function(l){
        return l.name;
      });

    centroids.enter()
      .append('circle')
      .attr("class", "centroid")
      .on('mouseenter', function(d) {
        var centroid = d3.select(this);
        
        var mouseCoords = d3.mouse(this);
        var cData = centroid.datum();
        tooltip.select('h5').text(cData.name);
        tooltip.select('p#tooltip-stat').text('$'+cData.revenue+' BILLION USD revenue'); 
        var countryClass = cData.name.replace(/ /g, '-');
        
        var w = parseInt(tooltip.style('width')),
            h = parseInt(tooltip.style('height'));
        tooltip.style('top', (mouseCoords[1]) - h + 'px');
        tooltip.style('left', (mouseCoords[0] - w/2) + 'px');
        
        d3.select(this).classed('active', true);
          
      })
      .on('mouseout', function(d) {
        tooltip.style('left', '-9999px');
        d3.select(this).classed('active', false);
      })
      .on('click', function(d){
        ogCoApp.displayPopup(d);
      });



    centroids.attr("name", function(d){ return d.name; })
      .attr('cx', function(d){
        return getCentroid(d)[0]
      })
      .attr('cy', function(d){
        return getCentroid(d)[1]
      })
      .classed('active', function(d) {
        return d.name === ogCoApp.activeCountry;
      })
      .transition().duration(ogCoApp.TRANS_DURATION)
      .style('opacity', 1)
      .attr('r', function(d) {
        // return radiusScale(+Math.round(d.revenue));
        return Math.sqrt(d.revenue*10);
      });


    centroids.exit()
      .style('opacity', 0);


  };


}(window.ogCoApp = window.ogCoApp || {}));