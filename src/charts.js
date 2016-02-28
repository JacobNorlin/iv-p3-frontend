"use strict";
import d3 from 'd3';
require('d3.parcoords.js');

function drawChart(data){
	var blue_to_brown = d3.scale.linear()
	.domain([9, 50])
	.range(["steelblue", "brown"])
	.interpolate(d3.interpolateLab);

	var pc1;

	pc1 = d3.parcoords()("#test")
	.data(data)
    .composite("darker")
    // .color(function(d) { return blue_to_brown(d.reach); })  // quantitative color scale
    // .alpha(0.35)
    .render()
    .createAxes();
    console.log(pc1.data());
}

export {drawChart};