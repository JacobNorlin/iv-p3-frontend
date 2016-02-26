"use strict";

import $ from 'jquery';
import {resturl} from './resturl.js';
import Rx from 'rx';
import _ from 'lodash';

export default class DataFetcher{

	constructor(){
		this.routes = {
			getCountryDatas: "getCountryDatas",
			getGenericDatas: "getGenericDatas",
			getCityDatas: "getCityDatas",
			getPostData: "getCityDatas",
			getDemographicDatas: "getDemographicDatas"
		};
	}
	
	getDxData(route, date){
		let diffDate = new Date(new Date(date).getTime() - 7*1000*60*60*24).toDateString();
		let firstDate = this.getData(route, date);
		let secondDate = this.getData(route, diffDate);
		return Rx.Observable.combineLatest(firstDate, secondDate)
			.take(1)
			.map(countryTuple => {
				return _(countryTuple[0])
				.zip(countryTuple[1])
				.map(t => {
					if(t[1]){
						t[0].lifetime_likes_dx = t[0].lifetime_likes - t[1].lifetime_likes;
						t[0].weekly_reach_dx = t[0].weekly_reach - t[1].weekly_reach;
					}
					
					return t[0];
				})
				.groupBy(t => {
					return t.weekly_reach;
				})
				.toArray()
				.sortBy(x => {
					return x[0].weekly_reach;
				})
				.reverse()
				.value();
			});
	}

	getData(route, date){
		var ret = null;
		if(date){
			return this._doRequest(route+"/"+date);
		}else{
			return this._doRequest(route);
		}
	}

	getCountryDatas(date){
		return this.getDxData(this.routes.getCountryDatas, date);
	}

	getGenericDatas(date){
		return this.getDxData(this.routes.getGenericDatas, date);
	}

	getPostData(date){
		return this.getDxData(this.routes.getPostData, date);
	}

	getCityDatas(date){
		return this.getDxData(this.routes.getCityDatas, date);
	}

	getDemographicDatas(date){
		return this.getDxData(this.routes.getDemographicDatas, date);
	}

	getCountries(){
		return this.getDxData("getCountries");
	}

	getCountryData(country){
		return this.getDxData("getCountryData/"+country);
	}


	_doRequest(dataType){
		console.log(resturl+dataType);
		return Rx.Observable.fromPromise($.ajax({
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
			})
		);
	}

}