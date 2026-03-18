module.exports = (app) => {
	const estibyitemapi = require('../ctrl/estibyitem.ctrl');
	var router = require('express').Router();
	console.log('load estibyitem api');
	// select all
	router.get('/', estibyitemapi.getAll);
	// select by id
	router.get('/getby', estibyitemapi.getBy);
	// create
	router.post('/', estibyitemapi.create);
	// update
	router.put('/', estibyitemapi.update);
	// delete
	router.delete('/', estibyitemapi.remove);
	// delete all estiitem by project
	router.delete('/removeall', estibyitemapi.removeAll);

	app.use('/api/estibyitem', router);

};