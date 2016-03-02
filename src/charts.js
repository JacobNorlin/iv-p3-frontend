"use strict";
import d3 from 'd3';
require('d3.parcoords.js');
import _ from 'lodash';


export default class ParCoords{

    constructor(data, divId, colorBy, useless){
        this.chart = this._drawChart(data, divId, colorBy, useless);
        this.currentSelection = [];
    }


    _drawChart(data, divId, color, useless){
        document.getElementById(divId).innerHTML = ""; //remove graph
        if(!useless){
            useless = [];
        }

        var pc1;

        pc1 = d3.parcoords()("#"+divId)
        .data(data)
        .hideAxis(useless)
        .composite("darken")
        .color(color)  
        .alpha(0.7)
        .render()
        .reorderable()
        .brushMode("1D-axes") 

        return pc1;
    }
}



