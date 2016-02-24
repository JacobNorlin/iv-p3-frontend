"use strict";
import $ from 'jquery';
import Parser from './parser.js';
import paper from 'paper';
import CountryVisualization from './countryvisualization.js';
import DataStore from './datastore.js';
import Rx from 'rx';
import _ from 'lodash';
// var file = new XMLHttpRequest();
// file.open("GET", "file://../data/Facebook Insights Data Export - Visualization Studio VIC - 2014-01-01 - 2014-02-27.csv");
// console.log(file);	
// file.onreadystatechange(() => {
// 	console.log(file.responseText);
// })


window.onload = function(){
	document.getElementById('countries').onclick = loadCountryDatas;
	document.getElementById('cities').onclick = loadCityDatas;
	document.getElementById('demographics').onclick = loadDemographicDatas;

	var ds = new DataStore();

	function loadCountryDatas(){
		ds.getCountryDatas("2015-04-02").done(foo);
	}
	function loadCityDatas(){
		ds.getCityDatas("2015-04-02").done(foo);
	}
	function loadDemographicDatas(){
		ds.getDemographicDatas("2015-04-02").done(foo);
	}
	var reachFilter = document.getElementById('reachFilter');
	var likeFilter = document.getElementById('likeFilter');
	var reachNumber = document.getElementById('reachNumber');
	var likeNumber = document.getElementById('likeNumber');

	var reachChange = Rx.Observable.fromEvent(reachFilter, 'change')
		.map(event => {
			return event.srcElement.value;
		});
	reachChange.subscribe(x => {
		reachNumber.innerHTML = x;
		av.filter('weeklyReach', x);
		
	});

	var likeChange = Rx.Observable.fromEvent(likeFilter, 'change')
			.map(event => {
				return event.srcElement.value;
			});
		likeChange.subscribe(x => {
			likeNumber.innerHTML = x;
			av.filter('lifetimeLikes', x);
		});
	function setUpFilters(maxLikes, maxReach){
		reachFilter.max = maxReach;
		likeFilter.max = maxLikes;
	}




	var av = null;


	function foo(data) {

		if(av){
			av.remove();
		}
		let maxLikes = _(data).map(row => {
			return row.lifetime_likes;
		})
		.sortBy(x => {return x;})
		.reverse()
		.value()[0];
		let maxReach = _(data).map(row => {
			return row.weekly_reach;
		})
		.sortBy(x => {return x;})
		.reverse()
		.value()[0];
		setUpFilters(maxLikes, maxReach);


	// let countryData = _.mapKeys(data, (value, key) => {
	// 	return value.country;
	// });
	let countryData = data;
	let cv = document.getElementById('myCanvas');
	console.log(countryData);
	av = new CountryVisualization(cv, countryData);



	var onFrame = function onFrame(event){
		timer += event.delta;
		if(timer > 2){
			timer = 0;
			_.forEach(av.balls, ball => {
				ball.fireLike();
			})
		}
	};
	// paper.view.onFrame = onFrame;
}


};


var timer = 0;


