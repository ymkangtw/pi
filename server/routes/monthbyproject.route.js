module.exports = (app) => {
	const monthbyprojectapi = require('../ctrl/monthbyproject.ctrl');
	var router = require('express').Router();
	console.log('load monthbyproject api');
	// select all
	router.get('/', monthbyprojectapi.getAll);
	// select by id
	router.get('/getby', monthbyprojectapi.getBy);
	// create
	router.post('/', monthbyprojectapi.create);
	// update
	router.put('/', monthbyprojectapi.update);
	// delete
	router.delete('/', monthbyprojectapi.remove);
	// delete all monthproject by project
	router.delete('/removeall', monthbyprojectapi.removeAll);

	app.use('/api/monthbyproject', router);

};