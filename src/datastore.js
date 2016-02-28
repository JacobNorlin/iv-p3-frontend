"use strict";

import $ from 'jquery';
import {resturl} from './resturl.js';
import Rx from 'rx';
import _ from 'lodash';
import CountryCodes from 'i18n-iso-countries';

export default class DataFetcher{

	constructor(){
		this.routes = {
			getCountryDatas: "getCountryDatas",
			getGenericDatas: "getGenericDatas",
			getCityDatas: "getCityDatas",
			getPostData: "getPostData",
			getDemographicDatas: "getDemographicDatas"
		};
		this.routeToType = {
			getCountryDatas: "country",
			getGenericDatas: "generic",
			getCityDatas: "city",
			getPostData: "post",
			getDemographicDatas: "demographic"
		};
	}
	
	getDxData(route, date){
		let diffDate = new Date(new Date(date).getTime() - 7*1000*60*60*24).toDateString();
		let firstDate = this.getData(route, date);
		let secondDate = this.getData(route, diffDate);
		return Rx.Observable.combineLatest(firstDate, secondDate)
			.take(1)
			.map(countryTuple => {
				let datas =  _(countryTuple[0])
				.zip(countryTuple[1])
				.map(t => {
					if(t[1]){
						t[0].lifetime_likes_dx = t[0].lifetime_likes - t[1].lifetime_likes;
						t[0].weekly_reach_dx = t[0].weekly_reach - t[1].weekly_reach;
					}
					// t[0][this.routeToType[route]] = CountryCodes.getName(t[0][this.routeToType[route]], "en");
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
				return {
					data: datas,
					type: this.routeToType[route]
				};
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
		return this.getData(this.routes.getGenericDatas, date);
	}

	getPostData(date){
		return this.getData(this.routes.getPostData, date);
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