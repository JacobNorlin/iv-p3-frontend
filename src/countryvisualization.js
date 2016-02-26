"use strict";

import paper from 'paper';
import _ from 'lodash';
import DataBall from './databall.js';
import {randomPointOnCircle,pointOnCircle} from './drawutils.js';
import VisualisationStudio from './visualisationstudio.js';

export default class CountryVisualization{
	
	remove(){
		paper.project.clear();
	}


	constructor(canvas, type, specData, genericData){
		this.currentFilters = {};
		this.type = type;
		this.specData = specData;
		paper.setup(canvas);
		this._getTypes(specData, type);
		// let background = new paper.Path.Rectangle(paper.view.center, new paper.Size(3000,3000));
		// background.fillColor = "black";

		paper.view.zoom = 0.5;
		this.visStudio = new VisualisationStudio(genericData);
		this.balls = this._createBalls(specData);
		console.log(this.balls);
		paper.view.draw();
	}

	update(newSpecData, genericData){

		let currentStructures = this._getType(this.specData, this.type);
		let newStructures = this._getType(newSpecData, this.type);
		let difference = _.difference(newStructures, currentStructures);



		for(let ball of this.balls){
			ball.data = specData;
		}
	}

	_checkFilter(ball){
		for(let prop in this.currentFilters){
			if(ball.path.data[prop] < this.currentFilters[prop]){
				return false;
			}
		}
		return true;
	}

	filter(prop, value){
		this.currentFilters[prop] = value;
		for(let ball of this.balls){

			if(!this._checkFilter(ball)){
				ball.setVisibility(false);
			}else{
				ball.setVisibility(true);
			}
		}
	}

	_createBalls(specData){
		// console.log(specData);
		let maxRange = 500;
		let tracks = specData.length > 1 ? specData.length : specData[0].length;
		let trackRadiusDiff = maxRange/tracks+1;
		let balls = new Array();
		if(specData.length > 1){
			for(let i = 0; i < tracks; i++){
				for(let country of specData[i]){
					balls.push(this._createBall(i, trackRadiusDiff, country));
				}
			}	
		}else{
			for(let i = 0; i < specData[0].length; i++){
				balls.push(this._createBall(i, trackRadiusDiff, specData[0][i]));
			}
		}
		
		return balls;
	}

	changeZoom(newZoom){
		// this.zoom += newZoom;
		paper.view.zoom += newZoom;
	}

	_createBall(i, trackRadiusDiff, country){
		let r = i*trackRadiusDiff;
		let pos = randomPointOnCircle(r, paper.view.center, 0);
		let ball = new DataBall(country, pos);
		return ball;
	}

	_getTypes(specData, type){
		return _(specData)
			.flatten()
			.map(row => {
				return row[type];
			}).value()
	}




}