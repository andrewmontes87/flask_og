/* global $, _, crossfilter, d3  */
(function(ogCoApp) {
    'use strict';
    
    var query = 'og_co'
    var q = queue()
        .defer(d3.json, "static/data/world-110m.json")
        .defer(d3.csv, "static/data/world-country-names.csv")
        .defer(ogCoApp.getDataFromAPI, query)
        .await(ready);
    
    function ready(error, worldMap, countryNames, ogCoData) {
      if(error){
          return console.warn(error);
      }
      ogCoApp.makeFilterAndDimensions(ogCoData);
      ogCoApp.initMap(worldMap, countryNames);
    	ogCoApp.initMenu();
    	ogCoApp.onDataChange();
    };

}(window.ogCoApp = window.ogCoApp || {}));