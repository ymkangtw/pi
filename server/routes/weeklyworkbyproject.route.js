module.exports = (app) => {
	const weeklyworkbyprojectapi = require('../ctrl/weeklyworkbyproject.ctrl');
	var router = require('express').Router();
	console.log('load weeklyworkbyproject api');
	// select all
	router.get('/', weeklyworkbyprojectapi.getAll);
	// select by id
	router.get('/getby', weeklyworkbyprojectapi.getBy);
	// create
	router.post('/', weeklyworkbyprojectapi.create);
	// update
	router.put('/', weeklyworkbyprojectapi.update);
	// delete
	router.delete('/', weeklyworkbyprojectapi.remove);
	// delete all weeklywork by project
	router.delete('/removeall', weeklyworkbyprojectapi.removeAll);

	app.use('/api/weeklyworkbyproject', router);

};