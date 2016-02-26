"use strict";
import $ from 'jquery';
import Parser from './parser.js';
import paper from 'paper';
import CountryVisualization from './countryvisualization.js';
import DataFetcher from './datastore.js';
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
	var reachFilter = document.getElementById('reachFilter');
	var likeFilter = document.getElementById('likeFilter');
	var reachNumber = document.getElementById('reachNumber');
	var likeNumber = document.getElementById('likeNumber');

	let timeline = document.getElementById('timelineFilter');
	var timeNumber = document.getElementById('currentTime');

	
	const firstDate = new Date("2014-01-08").getTime();
	const lastDate = new Date("2016-02-14").getTime();
	const oneDay = 24*60*60*1000;
	const dayRange = Math.round((lastDate - firstDate)/oneDay);
	timeline.max = dayRange;

	function getDate(day){
		let ms = firstDate+day*oneDay;
		let date = new Date(ms);
		return date.toDateString();
	}

	var ds = new DataFetcher();
	var currentRoute = ds.routes.getCountryDatas;
	var currentSelectedDate = "2015-03-10";


	timeline.oninput = (e) => {
		timeNumber.innerHTML = getDate(e.srcElement.value);
	};


	// ds.getPostData("2015-03-01").then((d) => {console.log(d)});
	// ds.getGenericDatas("2015-03-05").then((d) => {console.log(d)});

	function loadCountryDatas(){
		currentRoute = ds.routes.getCountryDatas;
		ds.getDxData(currentRoute, currentSelectedDate).subscribe(foo, "country");
	}
	function loadCityDatas(){
		currentRoute = ds.routes.getCityDatas;
		ds.getDxData(currentRoute, currentSelectedDate).subscribe(foo, "city");
	}
	function loadDemographicDatas(){
		currentRoute = ds.routes.getDemographicDatas;
		ds.getDxData(currentRoute, currentSelectedDate).subscribe(foo, "demographic");
	}

	let timelineChange = Rx.Observable.fromEvent(timeline, 'change')
		.map(event => {
			return event.srcElement.value;
		})
		.map(getDate)
		.flatMap(date => {
			return ds.getDxData(currentRoute, date);
		})
		.subscribe(foo);


	var reachChange = Rx.Observable.fromEvent(reachFilter, 'input')
		.map(event => {
			return event.srcElement.value;
		});
	reachChange.subscribe(x => {
		reachNumber.innerHTML = x;
		av.filter('weekly_reach', x);
		
	});

	var likeChange = Rx.Observable.fromEvent(likeFilter, 'input')
			.map(event => {
				return event.srcElement.value;
			});
		likeChange.subscribe(x => {
			likeNumber.innerHTML = x;
			av.filter('lifetime_likes', x);
		});
	function setUpFilters(maxLikes, maxReach){
		reachFilter.max = maxReach;
		likeFilter.max = maxLikes;
	}




	var av = null;


	$(document).keypress((e) => {
		if(e.keyCode === 122){
			av.changeZoom(0.3);
		}else if(e.keyCode === 120){
			av.changeZoom(-0.3);
		}
	})
	function foo(data, type) {
		currentSelectedDate = new Date(data[0][0].date).toDateString();
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

		timeNumber.innerHTML = currentSelectedDate;
	// let countryData = _.mapKeys(data, (value, key) => {
	// 	return value.country;
	// });
	let cv = document.getElementById('myCanvas');
	av = new CountryVisualization(cv, type, data);



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


