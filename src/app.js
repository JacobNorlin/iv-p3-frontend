"use strict";
import Parser from './parser.js';
import paper from 'paper';
import CountryVisualization from './countryvisualization.js';
import DataFetcher from './datastore.js';
import Rx from 'rx';
import _ from 'lodash';
import CountryCodes from 'i18n-iso-countries';
require('datatables.net');
import ParCoords from './charts.js';


//this really needs to be cleaned up and refactored
window.onload = function(){

	document.getElementById('countries').onclick = loadCountryDatas;
	document.getElementById('cities').onclick = loadCityDatas;
	document.getElementById('demographics').onclick = loadDemographicDatas;
	var reachFilter = document.getElementById('reachFilter');
	var likeFilter = document.getElementById('likeFilter');
	var reachNumber = document.getElementById('reachNumber');
	var likeNumber = document.getElementById('likeNumber');
	var table = $('#structureTable').dataTable( {
		pageLength: 150,
		columns:[
			{title: "Structure"},
			{title: "Lifetime Likes"},
			{title: "Lifetime Likes dx"},
			{title: "Weekly reach"},
			{title: "Weekly reach dx"},
		]
	});

	var chart = null;



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


	$('#structureTable tbody').on('click', 'tr', function () {
        let row = $(this)[0];
        let structure = row.innerText.split('\t')[0];
 		av.highlightBall(structure);
 		if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
        }
        else {
            $(this).addClass('selected');
        }
    } );

	$(document).keypress((e) => {
		if(e.keyCode === 122){
			av.changeZoom(0.3);
		}else if(e.keyCode === 120){
			av.changeZoom(-0.3);
		}
	})
	function foo(datas) {
		let data = datas.data;
		let type = datas.type;
		console.log(data);
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

	let cv = document.getElementById('myCanvas');
	av = new CountryVisualization(cv, type, data);

	//Set up datatable
	let ballData = _(av.balls).map(ball => {
		return ball.path.data;
	})
	.map(row => {
		return {Structure: row[type], "Lifetime Likes": row.lifetime_likes, "Lifetime Likes Dx": row.lifetime_likes_dx, "Weekly Reach": row.weekly_reach, "Weekly Reach Dx": row.weekly_reach_dx};
	}).value();
	

	chart = new ParCoords(ballData);
	
	//table stuff
	// table.fnClearTable();
	// table.fnAddData(ballData);


}


};


var timer = 0;


