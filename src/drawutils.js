"use strict"

import paper from 'paper';

function randomPointOnCircle(radius, center){
	let angle = Math.random()*(Math.PI*2); //Random angle
	let x = Math.cos(angle)*radius;
	let y = Math.sin(angle)*radius;
	let offset = new paper.Point(x,y);
	let pos = paper.view.center.add(offset);
	return pos;
}

function pointOnCircle(radius, center, angle){
	let x = Math.cos(angle)*radius;
	let y = Math.sin(angle)*radius;
	let offset = new paper.Point(x,y);
	let pos = center.add(offset);
	return pos;
}


function calculateRadius(lifetimeLikes){
	let r = Math.ceil(Math.log(lifetimeLikes))*2;
	return r > 4 ? r : 4	;
}

export {randomPointOnCircle, pointOnCircle, calculateRadius};