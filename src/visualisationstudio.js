"use strict";

import paper from 'paper';
import {pointOnCircle} from './drawutils.js';

export default class VisualisationStudio{

	constructor(data){
		this.data = data;

		// this.spiral = this.drawSpiral(50000);
		this.center = this.createVisStudio();
	}

	createVisStudio(genericData){

		var ball = paper.Path.Circle(paper.view.center, 10);
		ball.fillColor = "#c1c3e5";
		return ball;
	}

	onFrame(event){
		this.rotate(-0.5);
	}

	drawSpiral(reach){
		let n = reach / 100;
		let r = n
		console.log(r);
		let spiral = new paper.Path({
			strokeColor: "white",
			strokeWidth: 2,
			strokeCap: "round"
		});
		let segments = 50;
		let laps = 20*Math.PI*2;//5 circlings
		for(let i = 0; i < segments; i++){
			let curRadius = r - i*(r/segments);
			console.log(curRadius);
			let curAngle = laps - (i * (laps/segments));
			let p = pointOnCircle(curRadius, paper.view.center, curAngle);
			spiral.add(p);
		}
		spiral.smooth({type: 'continuous'});
		spiral.onFrame = this.onFrame;
		return spiral;

	}



}