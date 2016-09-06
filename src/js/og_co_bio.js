/* global $, _, crossfilter, d3  */
(function(ogCoApp){
  'use strict';


  // using jquery because d3 doesn't play well with materialize components
  ogCoApp.displayPopup = function(_cData){



    ogCoApp.getDataFromAPI('og_co/'+_cData._id,
      function(error, cData){
        if (error) {
          return console.warn(error);
        }
        $(document).ready(function() {

          // wacky hack to work around multiple sidenav issue
          // remove old and build a new sidenav each time
          // https://github.com/Dogfalo/materialize/issues/1894
          setTimeout(function () {

            $('#bio').remove();
            $('#sidenav-overlay').remove();
            $('.drag-target').remove();
            $('#side-nav-trigger').remove();

            $('body').append('<a data-activates="bio" id="side-nav-trigger"></a>');
            $('body').append('<ul class="side-nav" id="bio">'+
            '  <li id="picbox"><img /></li>'+
            '  <li><div class="divider"></div></li>'+
            '  <li><a class="waves-effect" id="bio-name"></a></li>'+
            '  <li><a class="waves-effect" id="bio-country"></a></li>'+
            '  <li><a class="waves-effect" id="bio-inception"></a></li>'+
            '  <li><a class="waves-effect" id="bio-type"></a></li>'+
            '  <li><a class="waves-effect" id="bio-revenue"></a></li>'+
            '  <li><div class="divider"></div></li>'+
            '  <li><a class="waves-effect" id="bio-wikilink" target="_blank"><b>Learn more >></b></a></li>'+
            '  <li><a class="waves-effect" id="bio-close">Close</a></li>'+
            '</ul>');

            $("#bio-name").text("Name: "+cData.name);
            $("#bio-country").text("Country: "+cData.country);
            $("#bio-inception").text("Inception: "+cData.inception);
            $("#bio-revenue").text("Revenue: $"+cData.revenue+" BILLION USD");
            $('#bio-wikilink').attr("href", cData.link);

            if (cData.isin){
              $("#bio-type").text("Company Type: Public");
            }else{
              $("#bio-type").text("Company Type: Private/State-owned");
            }

            if(cData.bio_img){
              $("#picbox img")
                .attr("src", "static/img/companies/"
                  +cData.bio_img);
            }else{
              $("#picbox img")
                .style("display", "none");
            }

            $('#side-nav-trigger').sideNav({
              menuWidth: 300, // Default is 240
              edge: 'right', // Choose the horizontal origin
              closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
            });

            $('#side-nav-trigger').sideNav('show');

          }, 100);

        });
      });
  }

}(window.ogCoApp = window.ogCoApp || {}));
