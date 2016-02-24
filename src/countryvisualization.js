"use strict";

import paper from 'paper';
import _ from 'lodash';
import DataBall from './databall.js';

export default class CountryVisualization{
	
	remove(){
		paper.project.clear();
	}

	constructor(canvas, countryData){
		this.currentFilters = {};
		paper.setup(canvas);
		this.drawVisStudio();
		this.drawCountries(countryData);
		paper.view.draw();
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

	drawCountries(data){
		this.balls = _.mapValues(data, (value, key) => {
			let pos = this.randomPointOnCircle(Math.max(1000/value.weekly_reach,50), this.visStudio.position);
			let ball = new DataBall(value, pos);
			return ball;
		});
	}

	randomPointOnCircle(radius, center){
		let angle = Math.random()*(Math.PI*2); //Random angle
		let x = Math.cos(angle)*radius;
		let y = Math.sin(angle)*radius;
		let offset = new paper.Point(x,y);
		let pos = center.add(offset);
		return pos;
	}

	pointOnCircle(radius, center, angle){
		let x = Math.cos(angle)*radius;
		let y = Math.sin(angle)*radius;
		let offset = new paper.Point(x,y);
		let pos = center.add(offset);
		return pos;
	}


	drawVisStudio(data){
		var ball = paper.Path.Circle(paper.view.center, 10);
		ball.fillColor = "black";
		this.visStudio = ball;
	}

}