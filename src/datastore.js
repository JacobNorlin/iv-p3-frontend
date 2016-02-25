"use strict";

import $ from 'jquery';
import {resturl} from './resturl.js';

export default class DataStore{
	
	

	getCountryDatas(date){
		var ret = null;
		if(date){
			ret = this._doRequest("getCountryDatas/"+date);
		}else{
			ret = this._doRequest("getCountryDatas");
		}
		return ret;
	}

	getCityDatas(date){
		var ret = null;
		if(date){
			ret = this._doRequest("getCityDatas/"+date);
		}else{
			ret = this._doRequest("getCityDatas");
		}
		return ret;
	}

	getDemographicDatas(date){
		var ret = null;
		if(date){
			ret = this._doRequest("getDemographicDatas/"+date);
		}else{
			ret = this._doRequest("getDemographicDatas");
		}
		return ret;
	}

	getCountries(){
		return this._doRequest("getCountries");
	}

	getCountryData(country){
		return this._doRequest("getCountryData/"+country);
	}


	_doRequest(dataType){
		console.log(resturl+dataType);
		return $.ajax({
			url: resturl+dataType,
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
			});
	}

}