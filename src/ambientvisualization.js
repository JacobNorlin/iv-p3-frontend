"use strict";

import paper from 'paper';
import _ from 'lodash';
import DataBall from './databall.js';

export default class AmbientVisualization{
	
	constructor(canvas){
		paper.setup(canvas);
		
		// Draw the view now:
		// this.genFractal(new paper.Point(10, 610), new paper.Point(610, 610), new paper.Point(310, 10), 7);
		// var ball = new DataBall({lifetimeLikes: 100}, paper);
		// this.drawVisStudio();
		paper.view.draw();
	}

	drawCountryView(data){
			this.balls = _(data).omit("Date")
				.mapValues((value, key, obj) => {
					return new DataBall({lifetimeLikes: value});
				}).value();
				paper.view.draw();
				console.log(this.balls);
	}


	drawVisStudio(data){
		var ball = paper.Path.Circle(paper.view.center, 50);
		ball.fillColor = "black";
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