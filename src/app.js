"use strict";
import $ from 'jquery';
import Parser from './parser.js';
import paper from 'paper';
import AmbientVisualization from './ambientvisualization.js';
// var file = new XMLHttpRequest();
// file.open("GET", "file://../data/Facebook Insights Data Export - Visualization Studio VIC - 2014-01-01 - 2014-02-27.csv");
// console.log(file);	
// file.onreadystatechange(() => {
// 	console.log(file.responseText);
// })


$.ajax({
	url: "localhost:3000/getCountryData",
	dataType: "jsonp",
	success: (data) => {
		console.log(data);
	}
})

function foo(data) {
	console.log(data);
	var canvas = document.getElementById('myCanvas');
	let av = new AmbientVisualization(canvas);
	av.drawCountryView(data.lifetimeLikesByCountry["2/21/2014"]);
	av.drawVisStudio();
}




let parser = new Parser();

parser.parse("https://dl.dropboxusercontent.com/u/7511501/Facebook%20Insights%20Data%20Export%20-%20Visualization%20Studio%20VIC%20-%202014-01-01%20-%202014-02-27.csv", foo);

// function test(data){
// 	console.log(data);
// }



// $.getJSON('http://localhost:3000/getData', (data, status) => {
// 	console.log(data);
// });

	