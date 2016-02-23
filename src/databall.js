"use strict";
import paper from 'paper';

export default class DataBall{
	
	constructor(data){
		this.SCALER = 1;

		this.radius = this.calculateRadius(data.lifetimeLikes);
		
		this.path = new paper.Path.Circle(new paper.Point(Math.random()*1000, Math.random()*1000), this.radius);
		this.path.fillColor = {
			hue: Math.random() * 360,
			saturation: 1,
			brightness: 1
		};

	}

	calculateRadius(lifetimeLikes){
		return lifetimeLikes/this.SCALER;
	}

	

}