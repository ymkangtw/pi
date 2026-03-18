module.exports = (app) => {
	const monthreportbyprjapi = require('../ctrl/monthreportbyprj.ctrl');
	var router = require('express').Router();
	console.log('load monthreportbyprj api');
	// select all
	router.get('/', monthreportbyprjapi.getAll);
	// select by id
	router.get('/getby', monthreportbyprjapi.getBy);
	// create
	router.post('/', monthreportbyprjapi.create);
	// update
	router.put('/', monthreportbyprjapi.update);
	// delete
	router.delete('/', monthreportbyprjapi.remove);
	// get monthwork by group
	router.get('/getmonthworkbygroup', monthreportbyprjapi.getMonthworkByGroup);
	// get monthwork by project
	router.get('/getmonthworkbyprj', monthreportbyprjapi.getMonthworkByPrj);

	app.use('/api/monthreportbyprj', router);

};