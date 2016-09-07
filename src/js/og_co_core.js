/* global $, _, crossfilter, d3  */
(function(ogCoApp){
  'use strict';
  ogCoApp.data = {};
  ogCoApp.groupByCountry = 0;
  ogCoApp.activeCountry = null;
  // ogCoApp.ALL_CATS = 'All Categories';
  ogCoApp.TRANS_DURATION = 2000;
  ogCoApp.MAX_CENTROUD_RADIUS = 100;
  ogCoApp.MIN_CENTROUD_RADIUS = 2;
  ogCoApp.colors = {palegold: '#E6BE8A'}

  ogCoApp.getDataFromAPI = function(resource, callback){
    d3.json($EVE_API + resource, function(error, data){
      if(error){
        return callback(error);
      }
      if ('_items' in data){
        callback(null, data._items);
      }
      else {
        callback(null, data)
      }
    });
  };

  ogCoApp.makeFilterAndDimensions = function(ogCoData){
    ogCoApp.ogCoFilter = crossfilter(ogCoData)
    ogCoApp.countryDim = ogCoApp.ogCoFilter.dimension(function(o){
      return o.country;
    });
    ogCoApp.nameDim = ogCoApp.ogCoFilter.dimension(function(o){
      return o.name;
    });
    ogCoApp.coTypeDim = ogCoApp.ogCoFilter.dimension(function(o){
      return o.isin ? 'Public' : 'Private/State-owned';
    });
  }


  ogCoApp.getData = function(){
    return ogCoApp.nameDim.top(Infinity);
  };

  ogCoApp.getCountryData = function(){
    var countryGroups = ogCoApp.countryDim.group().all()
    var data = countryGroups.map(function(c){
      return {
        key: c.key,
        value: c.value
      };  
    })
    .sort(function(a,b){ return b.value - a.value });
    return data;
  };

  ogCoApp.getRevenueData = function(){
    var names = ogCoApp.nameDim.top(Infinity);
    var data = names.map(function(c){
      return {
        key: c.name,
        value: c.revenue,
        _id: c._id
      };  
    })
    .sort(function(a,b){ return b.value - a.value });
    return data;
  };

  // string cleaning really ought to be done elsewhere
  var nestDataByDecade = function(entries){
    return ogCoApp.data.decades = d3.nest()
      .key(function(c){
        var thisDecade;
        if (c.inception.length > 4){
          thisDecade = c.inception.slice(c.inception.length-4,c.inception.length);
        } else {
          thisDecade = c.inception;
        }
        return String(thisDecade).replace(/.$/,"0")
      })
      .entries(entries);
  }

  ogCoApp.onDataChange = function() {

    $(document).ready(function() {
      $('select').material_select();
    });

    var locData = ogCoApp.getData();
    var countryData = ogCoApp.getCountryData();
    var revenueData = ogCoApp.getRevenueData();
    ogCoApp.updateMap(countryData, locData);
    ogCoApp.updateTimeChart(nestDataByDecade(ogCoApp.getData()));
    ogCoApp.updateBarChart(revenueData)

    // var options = [
    //   {selector: '#timeline', offset: 300, callback: function(el) {
    //     ogCoApp.updateTimeChart(nestDataByDecade(ogCoApp.getData()));
    //   } },
    //   {selector: '#bar', offset: 300, callback: function(el) {
    //     ogCoApp.updateBarChart(revenueData);
    //   } }
    // ];
    // Materialize.scrollFire(options);

  };


  $( window ).resize(function() {
      ogCoApp.onDataChange();      
  });

}(window.ogCoApp = window.ogCoApp || {}));