/* global $, _, crossfilter, d3  */
(function(ogCoApp){
  'use strict';

  d3.select('#type-select select')
    .on('change', function(d) {
      var coType = d3.select(this).property('value');
      if(coType === 'All'){
        // Reset the filter to all genders
        ogCoApp.coTypeDim.filter();
      }
      else{
        ogCoApp.coTypeDim.filter(coType);
      }
      ogCoApp.onDataChange();
    });


  ogCoApp.initMenu = function() {
    d3.selectAll('#radio input').on('change', function() {
      var val = d3.select(this).property('value');
      ogCoApp.groupByCountry = parseInt(val);
      ogCoApp.onDataChange();
    });
  };

}(window.ogCoApp = window.ogCoApp || {}))

