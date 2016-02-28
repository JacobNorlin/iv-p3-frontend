"use strict";
import d3 from 'd3';
require('d3.parcoords.js');
import _ from 'lodash';


export default class ParCoords{

    constructor(data, divId, colorBy){
        this.chart = this._drawChart(data, divId, colorBy);
        this.currentSelection = [];
    }


    _drawChart(data, divId, color){
        document.getElementById(divId).innerHTML = ""; //remove graph


        var pc1;

        pc1 = d3.parcoords()("#"+divId)
        .data(data)
        .composite("darken")
        .detectDimensions()
        .color(color)  

        .alpha(1)
        .render()
        .brushMode("1D-axes") 

        return pc1;
    }
}



