/* global $, _, crossfilter, d3  */
(function(ogCoApp){
  'use strict';



  ogCoApp.displayPopup = function(_cData){
    ogCoApp.getDataFromAPI('og_co/'+_cData._id,
      function(error, cData){
        if (error) {
          return console.warn(error);
        }

        var bio = d3.select("#bio");
        bio.select(".name").text(cData.name)

        // bio.selectAll('.property span')
        //   .text(function(d){
        //    var property = d3.select(this).attr('name');
        //    return cData[property];
        //   });
        console.log(cData)

        if(cData.bio_img){
          bio.select("#picbox img")
            .attr("src", "static/img/companies/"
              +cData.bio_img)
            .style("display", "inline")
        }else{
          bio.select("#picbox img")
            .style("display", "none")
        }

      });
  }


}(window.ogCoApp = window.ogCoApp || {}));
