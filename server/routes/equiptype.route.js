module.exports = (app) => {
	const equiptypeapi = require('../ctrl/equiptype.ctrl');
	var router = require('express').Router();
	console.log('load equiptype api');
	// select all
	router.get('/', equiptypeapi.getAll);
	// select by id
	router.get('/getby', equiptypeapi.getBy);
	// create
	router.post('/', equiptypeapi.create);
	// update
	router.put('/', equiptypeapi.update);
	// delete
	router.delete('/', equiptypeapi.remove);

	app.use('/api/equiptype', router);

};