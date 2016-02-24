"use strict";

import paper from 'paper';
import _ from 'lodash';
import DataBall from './databall.js';

export default class CountryVisualization{
	
	remove(){
		paper.project.clear();
	}

	constructor(canvas, countryData){
		paper.setup(canvas);
		this.drawVisStudio();
		this.drawCountries(countryData);
		paper.view.draw();
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



	genFractal(a, b, c, depth) {
		if (depth === 0) return;
		else {
			var ab = (a.add(b)).divide(2);
			var ac = (a.add(c)).divide(2);
			var bc = (b.add(c)).divide(2);
			this.drawTriangle(ab, ac, bc);
			paper.view.draw();

			this.genFractal(a, ab, ac, depth - 1);
			this.genFractal(ab, b, bc, depth - 1);
			this.genFractal(ac, bc, c, depth - 1);
		}
	}

	drawTriangle(a, b, c) {
		var path = new paper.Path();
		path.strokeColor = 'black';
		path.moveTo(a);
		path.lineTo(b);
		path.lineTo(c);
		path.lineTo(a);
		paper.view.draw();
	}





}