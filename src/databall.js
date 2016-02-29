"use strict";
import paper from 'paper';
import {calculateRadius} from './drawutils.js';
import $ from 'jquery';

export default class DataBall{
	
	/**
	Rotation speed scales with increase in reach
	Color is dependent on increase/decrease in reach
	Size of dot scales with lifetime likes
	Firelike rate scales with increase in likes
	Distance from center scales with weekly reach

	*/
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
		let f = 7/data.lifetime_likes_dx;
		this.path.data.fireFreq = f < 0 ? Math.Infinity : f;
		this.path.data.rotationSpeed = Math.abs(data.weekly_reach_dx*Math.PI/180);
		this.path.data.rotationDirection = data.weekly_reach_dx < 0 ? -1 : 1;
		this.path.trailTimer = 0;
		let strokeColor = this.path.data.rotationDirection >= 0 ? "#82CAFF" : "#FFB682";
		this.path.trail = new paper.Path({
			strokeColor: strokeColor,
			strokeWidth: 1,
			strokeCap: "round"
		});
		this.path.trail.storedColor = strokeColor;
		this.path.toCenterLine = new paper.Path({
			strokeColor: strokeColor,
			strokeWidth: 1,
			strokeCap: "round"
		});
		this.path.toCenterLine.storedColor = strokeColor;
		this.path.toCenterLine.add(this.path.position);
		this.path.toCenterLine.add(paper.view.center);
		// console.log(this.path.data.rotationSpeed);
	}

	highlight(val){
		if(val === true){
			this.path.trail.strokeColor = "#CBFF82";
			this.path.trail.strokeWidth = 5;
			this.path.toCenterLine.strokeColor = "#CBFF82";
			this.path.toCenterLine.strokeWidth = 5;
		}else{
			this.path.trail.strokeColor = this.path.trail.storedColor;
			this.path.trail.strokeWidth = 1;
			this.path.toCenterLine.strokeColor = this.path.toCenterLine.storedColor;
			this.path.toCenterLine.strokeWidth = 1;
		}
		
	}

	setVisibility(val){
		this.path.visible = val;
		this.path.trail.visible = val;
		this.path.toCenterLine.visible = val;
	}

	fireLike(){
		let like = new paper.Path.Circle(this.position, 2);
		like.strokeColor = "blue";
		like.opacity = 0.4;
		like.timer = 0;
		like.dTimer = 0;
		paper.view.draw();
		let onFrame = function(event){
			
			this.timer += event.delta;
			this.dTimer += event.delta;
			if(this.dTimer >0.05){
				this.dTimer = 0;
				this.scale(1.2);
				this.opacity -= 0.02;
				if(this.opacity <= 0.02){
					this.remove();
					this.timer = 0;
				}
			}
		};
		like.onFrame = onFrame;
	}

	onFrame(event){
		this.timer += event.delta;
		if(this.timer > this.data.fireFreq){
			this.timer = 0;
			this.fireLike();
		}
		this.toCenterLine.segments[0].point = this.position;
		this.trailTimer += event.delta;
		let trailLimit = 0.3;
		if(this.trailTimer > trailLimit){
			this.trailTimer = 0;	
			var p = this.position;

			this.trail.smooth();

			if(this.trail.segments.length > trailLimit*250){
				this.trail.removeSegment(0);	
			}
			this.trail.add(p);
		}

		let centerDistV = this.position.subtract(paper.view.center);
		let curAngle = centerDistV.angleInRadians;
		let dist = centerDistV.length;
		let angle = 0;
		if(this.data.rotationDirection >= 0){
			angle = (curAngle+(Math.PI/1000)*(this.data.rotationSpeed*4));
		}else{
			angle = (curAngle-(Math.PI/1000)*(this.data.rotationSpeed*4));
		}

		let x = Math.cos(angle)*dist;
		let y = Math.sin(angle)*dist;
		let offset = new paper.Point(x,y);
		let pos = paper.view.center.add(offset);
		this.position = pos;

	}
	

}