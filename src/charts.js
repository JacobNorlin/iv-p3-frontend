"use strict";
import d3 from 'd3';
require('d3.parcoords.js');
import _ from 'lodash';


export default class ParCoords{

    constructor(data){
        this.chart = this._drawChart(data);
    }


    _drawChart(data){
        document.getElementById("test").innerHTML = ""; //remove graph

        var blue_to_brown = d3.scale.linear()
        .domain([9, 40])
        .range(["steelblue", "brown"])
        .interpolate(d3.interpolateLab);

        var pc1;

        pc1 = d3.parcoords()("#test")
        .data(data)
        .composite("darken")
        .detectDimensions()
        .color(function(d) { return blue_to_brown(d["Weekly Reach"]); })  
        .alpha(0.35)
        .render()
        .brushMode("1D-axes") 

        return pc1;
    }
}



