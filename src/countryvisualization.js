"use strict";

import paper from 'paper';
import _ from 'lodash';
import DataBall from './databall.js';
import {randomPointOnCircle} from './drawutils.js';
import VisualisationStudio from './visualisationstudio.js';

export default class CountryVisualization{
	
	remove(){
		paper.project.clear();
	}

	constructor(canvas, specData, genericData){
		this.currentFilters = {};
		paper.setup(canvas);

		// let background = new paper.Path.Rectangle(paper.view.center, new paper.Size(3000,3000));
		// background.fillColor = "black";

		this.zoom = 1;
		this.visStudio = new VisualisationStudio(genericData);
		this.balls = this.createBalls(specData);
		console.log(this.balls);
		paper.view.draw();
	}

	update(specData, genericData){
		for(let ball of this.balls){
			ball.data = specData;
		}
	}

	checkFilter(ball){
		for(let prop in this.currentFilters){
			if(ball[prop] < this.currentFilters[prop]){
				return false;
			}
		}
		return true;
	}

	filter(prop, value){
		this.currentFilters[prop] = value;
		for(let idx in this.balls){
			let ball = this.balls[idx];

			if(!this.checkFilter(ball)){
				ball.path.visible = false;
			}else{
				ball.path.visible = true;
			}
		}
	}

	createBalls(specData){
		let maxRange = 450;
		let tracks = specData.length;
		let trackRadius = maxRange/tracks;
		for(let country of specData){
			
		}
		return _.mapValues(specData, (value, key) => {
			let r = maxRange/value.weekly_reach;
			r = Math.max(r, 50);
			r = Math.min(r, maxRange);
			let pos = randomPointOnCircle(r, this.visStudio.position);
			let ball = new DataBall(value, pos);
			console.log(ball.foo);
			// ball.onFrame = () => {
			// 	ball.move();
			// }
			return ball;
		});
	}


	changeZoom(newZoom){
		// this.zoom += newZoom;
		paper.view.zoom += newZoom;
	}

}