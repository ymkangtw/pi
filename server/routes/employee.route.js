module.exports = (app) => {
	const employeeapi = require('../ctrl/employee.ctrl');
	var router = require('express').Router();
	console.log('load employee api');
	// select all
	router.get('/', employeeapi.getAll);
	// select by id
	router.get('/getby', employeeapi.getBy);
	// create
	router.post('/', employeeapi.create);
	// update
	router.put('/', employeeapi.update);
	// delete
	router.delete('/', employeeapi.remove);

	app.use('/api/employee', router);

};