"use strict";
import paper from 'paper';
import {calculateRadius} from './drawutils.js';

export default class DataBall{
	
	constructor(data, pos){
		this.radius = calculateRadius(data.lifetime_likes);
		this.path = new paper.Path.Circle(pos, this.radius);
		this.path.data = data;
		this.path.onFrame = this.onFrame;
		this.path.fillColor = {
			hue: 200- 20*Math.random(),
			saturation: 1,
			brightness: 1,
			opacity: 1.5-Math.random()
		};
		this.path.timer = 0;
		this.path.fireLike = this.fireLike;
	}

	fireLike(){
		let like = new paper.Path.Circle(this.position, 2);
		like.strokeColor = "blue",
		like.opacity = 0.4;
		like.timer = 0;
		paper.view.draw();
		let onFrame = function(event){
			this.scale(1.05);
			this.opacity -= 0.005;
			this.timer += event.delta;
			if(this.opacity <= 0.02){
				this.remove();
				this.timer = 0;
			}
		};
		like.onFrame = onFrame;
	}

	onFrame(event){
		this.timer += event.delta;
		if(this.timer > 384/this.data.weekly_reach){
			this.timer = 0;
			this.fireLike();
		}

		let centerDistV = this.position.subtract(paper.view.center);
		let curAngle = centerDistV.angleInRadians;
		let dist = centerDistV.length;
		let angle = (curAngle+Math.PI/dist/30);
		angle += (this.data.weekly_reach_dx*Math.PI/180)/1000;

		let x = Math.cos(angle)*dist;
		let y = Math.sin(angle)*dist;
		let offset = new paper.Point(x,y);
		let pos = paper.view.center.add(offset);
		this.position = pos;

	}
	

}