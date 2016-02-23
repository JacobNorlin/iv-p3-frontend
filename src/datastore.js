"use strict"

import $ from 'jquery';

export default class DataStore{
	
	

	getCountryDatas(){
		return this.doRequest("getCountryDatas");
	}

	getCityData(){
		return this.doRequest("getCityData");
	}

	getDemographicData(){
		return this.doReqeuest("getDemographicData");
	}

	getCountries(){
		return this.doRequest("getCountries");
	}

	getCountryData(country){
		return this.doRequest("getCountryData/"+country);
	}


	doRequest(dataType){
		return $.ajax({
			url: "http://localhost:3000/"+dataType,
			type: 'GET',
			crossDomain: true,
			dataType: 'jsonp',
			error: function(err) {
				console.log(err);
				$.notify({
					message: 'GET Request failed!'
				},{
					type: 'danger'
				}); }
			})
	}

}