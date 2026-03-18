module.exports = (app) => {
	const weeklyreportbyprjapi = require('../ctrl/weeklyreportbyprj.ctrl');
	var router = require('express').Router();
	console.log('load weeklyreportbyprj api');
	// select all
	router.get('/', weeklyreportbyprjapi.getAll);
	// select by id
	router.get('/getby', weeklyreportbyprjapi.getBy);
	// create
	router.post('/', weeklyreportbyprjapi.create);
	// update
	router.put('/', weeklyreportbyprjapi.update);
	// delete
	router.delete('/', weeklyreportbyprjapi.remove);
	// get weekwork by group
	router.get('/getweekworkbygroup', weeklyreportbyprjapi.getWeekworkByGroup);
	// get weekwork by project
	router.get('/getweekworkbyprj', weeklyreportbyprjapi.getWeekworkByPrj);
	// get weekreport by group
	router.get('/getweekreportbygroup', weeklyreportbyprjapi.getWeekreportByGroup);

	app.use('/api/weeklyreportbyprj', router);

};