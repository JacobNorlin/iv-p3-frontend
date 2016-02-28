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
require('bootstrap');
import d3 from 'd3';



//this really needs to be cleaned up and refactored
window.onload = function(){

	document.getElementById('countries').onclick = loadCountryDatas;
	document.getElementById('cities').onclick = loadCityDatas;
	document.getElementById('demographics').onclick = loadDemographicDatas;
	document.getElementById('posts').onclick = loadPostDatas;
	document.getElementById('generics').onclick = loadGenericDatas;


	var genericDataDiv = document.getElementById('genericDataDiv')

	var reachFilter = document.getElementById('reachFilter');
	var likeFilter = document.getElementById('likeFilter');
	var reachNumber = document.getElementById('reachNumber');
	var likeNumber = document.getElementById('likeNumber');
	var table = $('#structureTable').dataTable( {
		pageLength: 150,
		columns:[
			{data: "Structure", title: "Structure"},
			{data: "Lifetime Likes", title: "Lifetime Like"},
			{data: "Lifetime Likes Dx", title: "Lifetime Like Dx"},
			{data: "Weekly Reach", title: "Weekly Reach"},
			{data: "Weekly Reach Dx", title: "Weekly Reach Dx"},
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


	var blue_to_brown = d3.scale.linear()
	.domain([9, 40])
	.range(["steelblue", "brown"])
	.interpolate(d3.interpolateLab);

	function loadGenericDatas(){
		ds.getGenericDatas()
			.subscribe(data => {
				let color = (d) => {return blue_to_brown(d.daily_engaged_users);};
				let useless = ["generic_key"];
				let plotData = _.map(data, row => {
					row.date = new Date(row.date).toDateString();
					return _.omit(row, useless);
				});
				console.log(data);
				new ParCoords(plotData, "genericDataDiv", color);
			});
	}

	function loadPostDatas(){
		ds.getPostData()
			.subscribe(data => {
				let color =  {
					"Photo": "#1f77b4",
					"Video": "#ff7f0e",
					"Link": "#2ca02c",
					"Status": "#d62728"
				}
				let useless = ["permalink", "post_id", "post_key", "post_message", "posted"];
				let plotData = _.map(data, row => {
					row.posted = new Date(row.posted).toDateString();
					return _.omit(row, useless);
				});
				console.log(plotData);
				new ParCoords(plotData, "genericDataDiv", (d) => {return color[d.type]});
			});
	}

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

	function createDataRow(structure, likes, likesdx, reach, reachdx){
		return {Structure: structure, "Lifetime Likes": likes, "Lifetime Likes Dx": likesdx, "Weekly Reach": reach, "Weekly Reach Dx": reachdx};
	}



	var av = null;


	$('#structureTable tbody').on('click', 'tr', function () {
        let row = $(this)[0];
        let structure = row.innerText.split('\t')[0];
        let d = row.innerText.split('\t');
        let r = createDataRow(d[0], parseInt(d[1]), parseInt(d[2]), parseInt(d[3]), parseInt(d[4]));
 		av.highlightBall(structure);
 		console.log(r);
 		if ( $(this).hasClass('selected') ) {
        	chart.chart.unhighlight()	;
            $(this).removeClass('selected');
        }
        else {
 			chart.chart.highlight([r]);
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
	


	chart = new ParCoords(ballData, "test", (d) => {return blue_to_brown(d["Weekly Reach"])});
	
	//table stuff
	table.fnClearTable();
	table.fnAddData(ballData);


}


};


var timer = 0;


