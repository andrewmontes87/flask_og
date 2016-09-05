/* global $, _, crossfilter, d3  */
(function(ogCoApp){
  'use strict';

  // using jquery to select and apply change function
  // d3 selection doesn't work for some reason
  $('#type-select').on('change', 'select', function(d){ 
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

}(window.ogCoApp = window.ogCoApp || {}));

