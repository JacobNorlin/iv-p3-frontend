// "use strict";
// import _ from 'lodash';
// import Papa from 'papaparse';

// export default class Parser{

// 	constructor(){
// 		this.geoFilters = {
// 			lifetimeLikes: "Lifetime Likes by ",
// 			lifetimeLikesByCountry: this.geoFilters.lifetimeLikes+"Country",
// 			lifetimeLikesByCity: 	this.geoFilters.lifetimeLikes+"City",
// 			lifetimeLikesByAgeAndGender: this.geoFilters.lifetimeLikes+"Gender and Age",
// 			weeklyReachDemographics: "Weekly Reach Demographics",
// 			weeklyReachByCountry: 	"Weekly Reach by Country",
// 			weeklyReachByCity: 		"Weekly Reach by City",
// 			// weeklyTotalImpressions: "Weekly Total Impressions", 
// 			date: 					"Date",
// 		};
		
// 	}

// 	useFilter(filter){
// 		return (value, key) => {
// 			return key.indexOf(filter) > -1 || key === this.geoFilters.date;
// 		};
// 	}

// 	filterData(data, filter){
// 		return _.map(data, obj => {
// 			return _.pickBy(obj,this.useFilter(filter));
// 		});
// 	}

// 	indexByDate(data){
// 		return _.mapKeys(data, (value, key) => {
// 			return value.Date;
// 		});
// 	}

// 	indexByCountry(dataIndexedByMetric){
// 		//Map XX by city/country to city/country
// 		_.groupBy(dataIndexedByMetric, )

// 		console.log(foo);
// 	}


// 	parse(csv, callback){
// 		Papa.parse(csv,{
// 			header:true,
// 			download:true,
// 			complete: (result) => {

// 				let data = result.data;

// 				let filteredData = _.mapValues(this.geoFilters, (filter, key, obj) => {
// 					return this.indexByDate(this.filterData(data, filter));
// 				});
// 				this.indexByCountry(filteredData);

// 				console.log(filteredData);
// 				callback(filteredData);
// 			}
// 		});
// 	}
// }