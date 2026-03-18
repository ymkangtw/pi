module.exports = (app) => {
	const drawingnoapi = require('../ctrl/drawingno.ctrl');
	var router = require('express').Router();
	console.log('load drawingno api');
	// select all
	router.get('/', drawingnoapi.getAll);
	// select by id
	router.get('/getby', drawingnoapi.getBy);
	// create
	router.post('/', drawingnoapi.create);
	// update
	router.put('/', drawingnoapi.update);
	// delete
	router.delete('/', drawingnoapi.remove);
	// delete all drawingno by project
	router.delete('/removeall', drawingnoapi.removeAll);

	app.use('/api/drawingno', router);

};