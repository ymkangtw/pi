module.exports = (app) => {
	const estibyprojectapi = require('../ctrl/estibyproject.ctrl');
	var router = require('express').Router();
	console.log('load estibyproject api');
	// select all
	router.get('/', estibyprojectapi.getAll);
	// select by id
	router.get('/getby', estibyprojectapi.getBy);
	// create
	router.post('/', estibyprojectapi.create);
	// update
	router.put('/', estibyprojectapi.update);
	// delete
	router.delete('/', estibyprojectapi.remove);
	// delete all estiproject by project
	router.delete('/removeall', estibyprojectapi.removeAll);

	app.use('/api/estibyproject', router);

};