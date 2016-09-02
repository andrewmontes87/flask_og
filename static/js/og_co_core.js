/* global $, _, crossfilter, d3  */
(function(ogCoApp){
  'use strict';
  ogCoApp.data = {};
  // ogCoApp.valuePerCapita = 0;
  ogCoApp.activeCountry = null;
  // ogCoApp.ALL_CATS = 'All Categories';
	ogCoApp.TRANS_DURATION = 2000;
	ogCoApp.MAX_CENTROUD_RADIUS = 30;
	ogCoApp.MIN_CENTROUD_RADIUS = 2;
	ogCoApp.colors = {palegold: '#E6BE8A'}

	var $EVE_API = 'https://oilgasapi.herokuapp.com/api/';

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
			console.log(o.isin);
			return o.isin ? 'Public' : 'Private/State-owned';
		});
	}


	ogCoApp.getData = function(){
		return ogCoApp.nameDim.top(Infinity);
	};

	ogCoApp.getCountryData = function(){
		var countryGroups = ogCoApp.countryDim.group().all();
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
				value: c.revenue
			};	
		})
		.sort(function(a,b){ return b.value - a.value });
		return data;
	};


	ogCoApp.onDataChange = function() {
		var locData = ogCoApp.getData();
		var countryData = ogCoApp.getCountryData();
		var revenueData = ogCoApp.getRevenueData();
		ogCoApp.updateBarChart(revenueData)
		ogCoApp.updateMap(countryData, locData);
	};

}(window.ogCoApp = window.ogCoApp || {}))